import numpy as np
from numpy.core.numeric import NaN

class Knn:
    # constructor
    def __init__(self, k):
        self.k = k
        self.x_train = ""
        self.y_train = ""
        
    # menghitung jarak dengan euclidean distance
    def calculate_distance(self, datapoint1, datapoint2):
        distance = 0.0
        for i in range(len(datapoint1)-1):
            distance += (datapoint1[i] - datapoint2[i])**2
        return distance**(1/2)
    
    # fitting
    def fit(self, x_train, y_train):
        self.x_train = x_train
        self.y_train = y_train

    # mengembalikan array hasil prediksi
    def predict(self, x_test):
        x_train = self.x_train
        y_train = self.y_train
        k = self.k
        predictions = []

        # menghitung jarak setiap data test dengan setiap data latih dan diambil k data terdekat
        for i in range(len(x_test)):
            distance_array = np.empty(shape=[0, 2])
            prediction = np.array([])
            for j in range(len(x_train)):
                dis = self.calculate_distance(x_test.iloc[i], x_train.iloc[j])
                distance_array = np.append(distance_array, [[dis, y_train.iloc[j]]], axis=0)
            # diurutkan menurun
            distance_array = distance_array[distance_array[:, 0].argsort()]
            nearest_neighbors = np.array([], dtype='int64')

            # mengambil label dari k data latih terdekat
            for l in range(k):
                nearest_neighbors = np.append(nearest_neighbors, distance_array[l][-1])

            nearest_neighbors = nearest_neighbors.astype(int)
            
            # mencari label yang paling sering muncul pada nearest_neighbors
            prediction = np.bincount(nearest_neighbors).argmax()
            predictions.append(prediction)
        return predictions