import random as rd
import numpy as np
from numpy.core.numeric import NaN

class KMeans:

    # constructor
    def __init__(self, k, n_iter):
        self.K = k
        self.max_iter = n_iter
        self.X = ""
        self.m = 0
        self.n = 0
        self.centroids = []
                
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
    def fit(self, x):        
        self.X = self.scaler(x)
        self.m = len(self.X.index)
        self.n = len(self.X.columns)
        
        # inisialisasi centroid dilakukan secara random
        centroids = np.empty(shape=[self.K, self.n])
        for i in range(self.K):
            rand = rd.randint(0, self.m-1)
            rand_sample = self.X.iloc[rand]
            centroids[i] = rand_sample
            
        self.centroids = centroids
        
    # prediksi (clustering)
    def predict(self):
        for i in range(self.max_iter):
            # berisi hasil clustering (centroid terdekat) pada setiap row secara berurutan
            cluster = []

            # menghitung jarak antara setiap data (row) terhadap setiap centroids, dan menambahkan centroid terdekat ke 'cluster'
            for j in range(self.m):
                # akan berisi jarak dari current row ke centroid dan cluster centroid 
                distance_array = np.empty(shape=[0, 2])
                for k in range(len(self.centroids)):
                    dis = self.calculate_distance(self.X.iloc[j], self.centroids[k])
                    distance_array = np.append(distance_array, [[dis, k]], axis=0)
                # diurutkan secara ascending
                distance_array = distance_array[distance_array[:, 0].argsort()]
                # centroid terdekat
                nearest_neighbors = int(distance_array[0][-1])
                cluster.append(nearest_neighbors)
                
            self.X["cluster"] = cluster

            # mencari centroid baru berdasarkan rata2 tiap cluster pada current iteration
            for j in range(self.K):
                self.centroids[j] = list(self.X[self.X['cluster']==j].mean())[:-1]
            
        cluster = self.X["cluster"]
        self.X.drop("cluster", axis=1, inplace=True)
                
        return list(cluster)