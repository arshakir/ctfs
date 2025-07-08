---
title: LCG_hack

published: 2025-07-02

description: Predicting a linear congruential generator

tags: [LCG, Python, Programming]

category: Junior.Crypt.2025
---

# LCG_hack
> Let's try to hack the Linear Congruential Generator for pseudorandom numbers (PRN). Its formula is: Xn+1 = (A * Xn + B) mod M You can ask for several consecutive PRNs, up to 50. And then guess the next PRN.

## Server file
```python
import math
import time

flag = "FAKE_FLAG"

m=math.ceil(time.time()*1000000)
a=2**15-1
b=2**51-1

x = m
rand_numbers = [x,]

for i in range(1,50):
    x = (a*x + b) % m
    rand_numbers.append(x)
    
d = """
Попробуем взломать Линейный Конгруэнтный Генератор псевдослучайных чисел (ПСЧ).
Его формула: Xn+1 = (A * Xn + B) mod M
Вы можете попросить несколько последовательных ПСЧ, до 50 штук.
А затем угадать следующее ПСЧ."""
print (f"{d}\n\n")
print ('1. Получить следующее число')
print ('2. Угадать следующее число')
ind = 0

while True:
    if ind == len(rand_numbers):
        print ('Слишком долго думаешь. Отдохни ...')
        break
    inp = input('> ')
    if inp == '1':
        print (f"Следующее число: {rand_numbers[ind]}")
    elif inp == '2':
        ans = int(input('Ваше число: '))
        if ans == rand_numbers[ind]:
            print (f"\nФлаг: {flag}")
        else:
            print (f"\nОшибка. Мое число: {rand_numbers[ind]}")
        break
    ind += 1
```

Basically we can get up to 50 random numbers by sending 1 and we must guess the next random number after sending 2 to get the flag

If we do some googling we can find that LCG can be easily hacked by finding m after a few inputs from [this post](https://security.stackexchange.com/questions/4268/cracking-a-linear-congruential-generator)
> To recover m, define tn = sn+1 - sn and un = |tn+2 tn - t2n+1|; then with high probability you will have m = gcd(u1, u2, ..., u10). 10 here is arbitrary; if you make it k, then the probability that this fails is exponentially small in k. I can share a pointer to why this works, if anyone is interested.

So all we need is about 10 inputs and we can crack m and a and b are already give to us so we can predict the next number

## Solution

```python
import math
from functools import reduce
from pwn import *

def compute_m(l, k=10):
    t = [l[i+1] - l[i] for i in range(len(l) - 1)]

    u = [abs(t[i+2] * t[i] - t[i+1]**2) for i in range(min(k, len(t) - 2))]

    return reduce(math.gcd, u)

io = remote('ctf.mf.grsu.by', 9042)
output = io.readuntil(b'>')

l = []

for i in range(10):
    io.sendline(b"1")
    o = io.recvline()
    num = int(o.decode().split(': ')[1].strip(" \n'"))
    l.append(num)

print("L:", l)
m = compute_m(l)
print("M:", m)

a=2**15-1
b=2**51-1

print("NEXT GUESS:", (a*l[-1]+b)%m)
io.interactive()
```

Now if we run this script we can get our next num that predict it and submit it to get our flag

```
[+] Opening connection to ctf.mf.grsu.by on port 9042: Done
L: [1751589033459241, 500210780226006, 1288260367646571, 1383560121169104, 987337136181212, 726704037818340, 1310097128850632, 508799809806322, 719158238923142, 1030958447650747]
M: 1751589033459241
NEXT GUESS: 769565657331029
[*] Switching to interactive mode
> $ 2
Ваше число: $ 769565657331029

Флаг: grodno{8e78c0436448239239fe54646addf1e34}
[*] Got EOF while reading in interactive
$
[*] Closed connection to ctf.mf.grsu.by port 9042
```

## Conclusion

Don't use an LCG to generate random numbers its really easy to predict
