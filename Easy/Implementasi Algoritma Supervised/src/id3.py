import numpy as np
import warnings

from numpy.core.numeric import NaN

class id3:
    def __init__(self):
        self.x_train = ""
        self.y_train = ""
        self.tree = {}

    # menghitung entropy dari p dan n
    def entropy(self, p, n):        
        total = p+n
        wp = p/total
        wn = n/total

        # mengabaikan warning untuk nilai infinity
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            sum1 = -(wp*np.log2(wp))
            sum2 = -(wn*np.log2(wn))

        # jika pada proses sebelumnya didapatkan nan karena dilakukan operasi dengan infinity, maka akan diset menjadi 0
        sum1 = 0 if np.isnan(sum1) else sum1
        sum2 = 0 if np.isnan(sum2) else sum2
        return sum1 + sum2

    # mengembalikan nilai information gain 
    def info_gain(self, dataframe, dataframe_feature, dataframe_target, prior_entropy):
        feature = dataframe[dataframe_feature].unique()
        remaining_entropy = np.array([])
        total = dataframe[dataframe_feature].count()

        # menghitung remaining entropy untuk seluruh nilai pada dataframe_feature
        for f in feature:
            p = dataframe[(dataframe[dataframe_feature]==f) & (dataframe[dataframe_target]==1)][dataframe_feature].count()
            n = dataframe[(dataframe[dataframe_feature]==f) & (dataframe[dataframe_target]==0)][dataframe_feature].count()
            ent = self.entropy(p, n)
            w = (p+n)/total
            remaining_entropy = np.append(remaining_entropy, w*ent)
        remaining_entropy = remaining_entropy.sum()
        return prior_entropy - remaining_entropy
    
    # mengembalikan kolom dengan info gain tertinggi
    def get_max_info_gain(self, x, y):
        info_dict = {}
        target = y.name
        
        x[target] = y
        p = x[x[target]==1][target].count()
        n = x[x[target]==0][target].count()
        prior_ent = self.entropy(p, n)
        for column in x.columns[:-1]:
            info = self.info_gain(x, column, target, prior_ent)
            info_dict.update({column: info})

        return max(info_dict, key=info_dict.get)

    # mengembalikan "pohon" berupa dictionary
    def build_tree(self, x_train, y_train, prior_att=None):
        node = self.get_max_info_gain(x_train, y_train)
        
        target = y_train.name
        x_train[target] = y_train
        
        attributes = x_train[node].unique()
                          
        tree = {}
        tree[node] = {}
            
        for att in attributes:
            sub = x_train[x_train[node] == att].reset_index(drop=True)
            x_sub = sub.iloc[:, :-1]
            y_sub = sub.iloc[:, -1]
            class_value, class_count = np.unique(sub[target], return_counts=True)

            if len(class_count)==1:
                tree[node][att] = class_value[0] 
            elif prior_att == att:
                tree[node][att] = sub[target].mode()[0]
            else:        
                tree[node][att] = self.build_tree(x_sub, y_sub, att)

        return tree
    
    def fit(self, x_train, y_train):
        self.x_train = x_train
        self.y_train = y_train
        self.tree = self.build_tree(self.x_train, self.y_train)
    
    # memprediksi sebuah baris berdasarkan "pohon" yang telah dibuat
    def predict_row(self, row, tree):
        nodes = list(tree.keys())
        i = 0
        prediction = ""
        while((type(tree) is dict) and i<len(nodes)):
            att = row[nodes[i]]
            tree = tree[nodes[i]][att]

            if(type(tree) == dict):
                prediction = self.predict_row(row, tree)
            else:
                prediction = tree
            
            i += 1
        
        return prediction
        
    # memprediksi data dengan melakukan iterasi tiap baris
    def predict(self, x_test):
        predictions = []
        for i in range(len(x_test)):
            predictions.append(self.predict_row(x_test.iloc[i], self.tree))
        
        return predictions