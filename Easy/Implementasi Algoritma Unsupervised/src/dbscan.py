import numpy as np
class DBScan:
    def __init__(self, epsilon, min_pts):
        self.epsilon = epsilon
        self.min_pts = min_pts
        self.X = ""
        self.cluster = []
        
    # menghitung jarak dengan euclidean distance
    def calculate_distance(self, datapoint1, datapoint2):
        distance = 0.0
        for i in range(len(datapoint1)-1):
            distance += (datapoint1[i] - datapoint2[i])**2
        return distance**(1/2)
    
    # mengembalikan rata2 (mean) dan standar deviasi (std) dari setiap kolom pada sebuah dataset berupa dictionary
    def getMeanStd(self, df):
        res = {}
        for column in df.columns:
            res[column] = {}
            res[column]["mean"] = df[column].mean()
            res[column]["std"] = df[column].std()
        return res

    # mengembalikan dataframe baru berupa hasil standard scaling dari dataframe masukan
    def scaler(self, df):
        df_copy = df.copy()
        meanstd = self.getMeanStd(df_copy)
        for column in df_copy.columns:
            df_copy[column] = df_copy[column].apply(lambda x: ((x - meanstd[column]["mean"])/meanstd[column]["std"]))
        return df_copy
    
    # dataframe masukan distandardisasi
    def fit(self, df):
        self.X = self.scaler(df)
        
    # mengembalikan array hasil clustering secara berurutan
    def predict(self):
        # inisialisasi dengan 0, outliers akan tetap bernilai 0
        cluster = np.zeros(len(self.X), dtype=int)

        c = 0
        n_c = c # banyak cluster yang telah dibuat
        for i in range(len(self.X)):
            if(cluster[i]==0):  # tidak masuk ke dalam jangkauan epsilon sebuah core
                n_c += 1    # membuat cluster baru, banyak cluster bertambah
                c = n_c   
            else:   # sudah berada pada epsilon sebuah core
                c = cluster[i]  # c bernilai cluster data ke-i
                
            for j in range(len(self.X)):
                dist = self.calculate_distance(self.X.iloc[i], self.X.iloc[j])

                # meng-assign data ke-j sebagai cluster dari core (data ke-i)
                if(dist<=self.epsilon): # masuk ke dalam jangkauan epsilon data ke-i
                    cluster[j] = c


        self.cluster = cluster
        return self.cluster