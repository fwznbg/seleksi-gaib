from src.qlearning import Banana

eps = float(input("Masukkan nilai epsilon: "))
lr = float(input("Masukkan nilai learning rate: "))
df = float(input("Masukkan nilai discount factor: "))

bnn = Banana(eps, lr, df)
bnn.q_learn(10)