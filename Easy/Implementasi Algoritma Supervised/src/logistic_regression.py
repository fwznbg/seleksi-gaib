import numpy as np
from numpy.core.numeric import NaN
class Logistic_regression:
    # constructor
    def __init__(self, learning_rate, epoch):
        self.learning_rate = learning_rate
        self.epoch = epoch
        self.X = ""
        self.Y = ""
        self.m = 0
        self.n = 0
        self.W = []
        self.b = 0
        
    # menghitung nilai sigmoid dari z
    def sigmoid(self, z):
        return 1.0/(1 + np.exp(-z))
    
    # menghitung gradient W dan b dari y_hat (hasil kembalian dari fungsi sigmoid)
    def gradient(self, y_hat):
        dW = np.dot(self.X.T, (y_hat - self.Y))/self.m
        db = np.sum((y_hat - self.Y))/self.m
        return dW, db
        
    # pelatihan data
    def fit(self, x_train, y_train):
        self.m = len(x_train)
        self.n = len(x_train.iloc[0])
        self.W = np.zeros(self.n)
        self.b = 0
        self.X = x_train
        self.Y = y_train
        
        # proses iterasi untuk mendapat nilai W dan b
        for i in range(self.epoch):
            z = np.dot(self.X, self.W) + self.b
            y_hat = self.sigmoid(z)
            dW, db = self.gradient(y_hat)
 
            self.W = self.W - self.learning_rate * dW 
            self.b = self.b - self.learning_rate * db
        return self
    
    #  mengembalikan array hasil prediksi
    def predict(self, x_test):
        # z dihitung dari W dan b pada proses fit (pelatihan)
        z = np.dot(x_test, self.W) + self.b
        predictions = self.sigmoid(z)  

        # hasil prediksi akan bernilai 1 jika besar dari sigmoid yang didapat lebih dari 0.5 dan sebaliknya
        Y = [1 if pred > 0.5 else 0 for pred in predictions]
        return Y