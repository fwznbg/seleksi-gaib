import random as rd
import numpy as np
from numpy.core.numeric import NaN
class KMedoids:
    def __init__(self, k):
        self.K = k
        self.m = 0
        self.n = 0
        self.X = ""
        self.medoids = []
        self.current_cost = 0
        self.clusters = []

    # menghitung jarak dengan euclidean distance
    def calculate_distance(self, datapoint1, datapoint2):
        distance = 0.0
        for i in range(len(datapoint1)-1):
            distance += (datapoint1[i] - datapoint2[i])**2
        return distance**(1/2)
        
    # mengembalikan cost dari total jarak setiap data ke medoids dan hasil clustering
    def calculate_cost(self, df, medoids):
        distance_cluster = []
        clusters = []
        
        for i in range(self.m):
            distance_array = np.empty(shape=[0, 2])
            for j in range(len(medoids)):
                dis = self.calculate_distance(df.iloc[i], medoids[j])
                distance_array = np.append(distance_array, [[dis, j]], axis=0)
            distance_array = distance_array[distance_array[:, 0].argsort()] 
            distance_cluster.append(distance_array[0][0])
            clusters.append(int(distance_array[0][-1]))
                
        cost = np.sum(distance_cluster, axis=0)
        return cost, clusters
    
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
    
    # mengembalikan nilai cost awal dan clustering awal dengan medoids diambil secara acak dan dataframe masukan distandardisasi
    def fit(self, df):
        self.X = self.scaler(df)
        self.m = len(self.X)
        self.n = len(self.X.columns)
        self.medoids = np.empty(shape=[self.K, self.n])
        
        for i in range(self.K):
            rand = rd.randint(0, self.m-1)
            rand_sample = self.X.iloc[rand]
            self.medoids[i] = rand_sample
            
        self.current_cost, self.clusters = self.calculate_cost(self.X, self.medoids)
        
    # mengembalikan hasil clustering
    def predict(self):
        for i in range(len(self.medoids)):
            new_medoids = self.medoids
            for j in range(len(self.X)):
                row = self.X.iloc[j]
                if((new_medoids[i] != row).any()):
                    new_medoids[i] = row
                    cost, pred = self.calculate_cost(self.X, new_medoids)
                    if(cost<self.current_cost):
                        self.current_cost = cost
                        self.clusters = pred
                        self.medoids = new_medoids
                        new_medoids = self.medoids
        return self.clusters