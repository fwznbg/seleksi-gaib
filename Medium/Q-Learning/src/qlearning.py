import numpy as np
import random as rd
import time

class Banana:
    def __init__(self, learning_rate, discount_factor):
        self.env_rows = 1
        self.env_columns = 10
        self.starting_loc = 3
        self.actions = ['right', 'left']
        # inisialisasi q values
        self.q_values = np.zeros((self.env_rows, self.env_columns, len(self.actions)))
        
        #  kotak selain kotak ke-0 dan ke-9 akan memiliki reward 0
        rewards = [0 for i in range(10)]
        rewards[0] = -1
        rewards[-1] = 1
        self.rewards = rewards
        self.my_reward = 0

        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.path = []
        self.win = 0
        self.lose = 0
    
    # mengembalikan nilai apakah player sedang berada di kotak ke-0 atau ke-9
    def is_terminal_state(self, current_idx):
        return self.rewards[current_idx] != 0
    
    # mengembalikan index action untuk langkah selanjutnya
    def get_next_action(self, current_idx):
        # mengembalikan index action dengan performa terbaik
        return np.argmax(self.q_values[0, current_idx])

        
    # mengembalikan index untuk langkah selanjutnya
    def get_next_loc(self, current_idx, action_idx):
        new_idx = current_idx
        if self.actions[action_idx] == 'right' and current_idx<9:
            new_idx += 1
        elif self.actions[action_idx] == 'left' and current_idx>0:
            new_idx -= 1
        # berada di terminal state
        else:
            new_idx = self.starting_loc
        return new_idx
    
    # mengembalikan array yang berisi path untuk memenangkan game
    def get_path_to_banana(self, start_idx):
        current_idx = start_idx        
        self.path = []
        self.my_reward += self.rewards[current_idx]
        self.path.append(current_idx)
        
        while(self.my_reward<5 and self.my_reward>-5):      
            action_idx = self.get_next_action(current_idx)
            current_idx = self.get_next_loc(current_idx, action_idx)
            
            self.my_reward += self.rewards[current_idx]
            self.path.append(current_idx)
        
        if(self.my_reward==5):
            self.win += 1
        elif (self.my_reward==-5):
            self.lose += 1
            
        self.my_reward = 0
        
        return self.path
    
    # mencetak permainan ke layar berdasarkan path yang didapat
    def render(self, eps):      
        print("Episode", eps, "\t", "Win:", self.win, "| Lose:", self.lose, end="\r")
        time.sleep(0.7)
        for p in self.path:
            board = ['-' for i in range(10)]
            board[0] = 'H'
            board[-1] = 'B'
            board[p] = 'P'
            board = "".join(board)

            print(board, "\t", "Win:", self.win, "| Lose:", self.lose, end="\r")
            time.sleep(0.1)
         
    # menghitung temporal difference
    def temporal_difference(self, reward, discount_factor, q_val, prev_q):
        return reward + (discount_factor * q_val) - prev_q
    
    # menghitung nilai Q baru
    def bellman_eq(self, prev_q, learning_rate, temporal_difference):
        return prev_q + (learning_rate * temporal_difference)
    
    # proses learning
    def q_learn(self, episode):
        for eps in range(episode):
            idx = self.starting_loc
            while not self.is_terminal_state(idx):
                action_idx = self.get_next_action(idx)

                prev_idx = idx
                idx = self.get_next_loc(idx, action_idx)
                reward = self.rewards[idx]

                prev_q_val =self.q_values[0, prev_idx, action_idx]
                td = self.temporal_difference(reward, self.discount_factor, np.max(self.q_values[0, idx]), prev_q_val)
                new_q_val = self.bellman_eq(prev_q_val, self.learning_rate, td)
                self.q_values[0, prev_idx, action_idx] = new_q_val
                
            path = self.get_path_to_banana(self.starting_loc)
            self.render(eps+1)
        self.win = 0
        self.lose = 0
        print("\n")
        print("Q-Table")
        print("column  |", "right  \t|", "left")
        print("-"*33)
        for row in self.q_values:
            for i in range(len(row)):
                print("{0}\t| {1:2f} \t| {2:2f}".format(i, row[i][0],  row[i][-1]))