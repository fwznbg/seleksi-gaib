from src.qlearning import Banana

lr = float(input("Masukkan nilai learning rate: "))
df = float(input("Masukkan nilai discount factor: "))
eps = int(input("Masukkan nilai episode: "))

bnn = Banana(lr, df)
bnn.q_learn(eps)