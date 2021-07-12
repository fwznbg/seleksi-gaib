from src.knn import Knn
from src.logistic_regression import Logistic_regression
from src.id3 import id3

import pandas as pd
import numpy as np

# membagi data latih dan data tes secara acak
def train_test_split(dataframe, split=0.6):
    dataframe_copy = dataframe.copy()
    n_data = len(dataframe_copy)
    train_size = n_data*split

    x_train = pd.DataFrame()
    x_test = pd.DataFrame()
    y_train = pd.DataFrame()
    y_test = pd.DataFrame()

    while(len(x_train.columns)<train_size):
        idx = np.random.choice(dataframe_copy.index, replace=False)
        x_train = pd.concat([x_train, dataframe_copy.loc[idx, :]], axis=1)
        dataframe_copy = dataframe_copy.drop(idx)

    x_train = x_train.T
    x_test = dataframe_copy.copy()
    
    y_train = x_train[x_train.columns[-1]] 
    y_test = x_test[x_test.columns[-1]]     

    x_train.drop(x_train.columns[-1], axis=1, inplace=True)
    x_test.drop(x_test.columns[-1], axis=1, inplace=True)
        
    
    return x_train, x_test, y_train, y_test

# casting seluruh fitur menjadi tipe float jika memungkinkan (numerik), jika tidak (kategorikal) akan diabaikan (dihapus) 
def convert_to_float(dataframe):
    df = pd.DataFrame()
    for column in dataframe.columns:
        try:
            df[column] = pd.to_numeric(dataframe[column], downcast="float")
        except:
            pass
    return df
    
# mengembalikan dataframe dengan seluruh fitur bertipe numerik telah dihapus dan menyisakan fitur kategorik
def drop_non_kategorik(dataframe):
    df = pd.DataFrame()
    for column in dataframe.columns:
        if(type(dataframe[column][0])==str):
            df[column] = dataframe[column]
    target = dataframe.columns[-1]
    df[target] = dataframe[target] 
    return df

# mengembalikan dictionary dengan value adalah nilai max dan min dari setiap fitur pada sebuah dataframe
def minmax(dataframe):
    minmax = {}
    for column in dataframe.columns:
        minmax[column] = {}
        minmax[column]["max"] = dataframe[column].max()
        minmax[column]["min"] = dataframe[column].min()
    return minmax

# mengembalikan dataframe yang sudah dinormalisasi
def normalize(dataframe, minmax):
    for column in dataframe.columns:
        dataframe[column] = dataframe[column].apply( lambda x: (x - minmax[column]["min"])/(minmax[column]["max"] - minmax[column]["min"]))
    return dataframe

while(True):
    print("1. KNN")
    print("2. Logistic Regression")
    print("3. ID3")
    print("4. Exit")
    print()

    menu = int(input("Pilih menu (1/2/3/4): "))
    print()
    

    if(menu==4):
        break   
    
    csv_file = input("Nama file: ")
    df = pd.read_csv(csv_file)

    if(menu==3):
        df = drop_non_kategorik(df)
        x_train, x_test, y_train, y_test = train_test_split(df)

        print("Predicting...")
        id_3 = id3()
        id_3.fit(x_train, y_train)
        pred = id_3.predict(x_test)
    else:
        df = convert_to_float(df)
        if(menu==1):
            x_train, x_test, y_train, y_test = train_test_split(df)
            k = int(input("Masukkan banyak K: "))
            print("Predicting...")
            knn = Knn(k)
            knn.fit(x_train, y_train)
            pred = knn.predict(x_test)
        else:
            df = normalize(df, minmax(df))
            x_train, x_test, y_train, y_test = train_test_split(df)
            learning_rate = float(input("Masukkan jumlah learning rate: "))
            epochs = int(input("Masukkan jumlah epoch: "))
            print("Predicting...")
            logres = Logistic_regression(learning_rate, epochs)
            logres.fit(x_train, y_train)
            pred = logres.predict(x_test)
    
    print(pred)
    print()
    print()
quit()