import pandas as pd

from src.dbscan import DBScan
from src.kmeans import KMeans
from src.kmedoids import KMedoids


while(True):
    print("1. DBScan")
    print("2. KMeans")
    print("3. KMedoids")
    print("4. Exit")
    print()

    menu = int(input("Pilih menu (1/2/3/4): "))
    print()
    
    if(menu==4):
        break   
    
    csv_file = input("Nama file: ")
    df = pd.read_csv(csv_file)

    if(menu==1):
        eps = float(input("Masukkan jumlah epsilon: "))
        min_pts = int(input("Masukkan jumlah minimal points: "))
        dbscan = DBScan(eps, min_pts)
        dbscan.fit(df)
        print("clustering,..")
        cluster = dbscan.predict()
    else:
        K = int(input("Masukkan jumlah K: "))
        if(menu==3):
            kmedoids = KMedoids(K)
            kmedoids.fit(df)
            print("clustering,..")
            cluster = kmedoids.predict()

        else:
            iterations = int(input("Masukkan jumlah iterasi max: "))
            kmeans = KMeans(K, iterations)
            kmeans.fit(df)
            print("clustering,..")
            cluster = kmeans.predict()
    
    print(cluster)
    print()
    print()
quit()