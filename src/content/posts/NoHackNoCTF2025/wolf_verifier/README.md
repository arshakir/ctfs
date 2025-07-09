---
title: 🐺 Verifier

published: 2025-07-08

description: Predicting a pythons PRNG and decrypting RSA

tags: [crypto, PRNG, RSA]

category: No Hack No CTF 2025
---

# 🐺 Verifier 
> Welcome to my new verifier system, hope to be safe ;P
> Wolves are social animals

## Code
```python title="chal.py"
from Crypto.Util.number import *
from random import getrandbits

SIZE = 64
FLAG = bytes_to_long(b'NHNC{FAKE_FLAG}')
e = 37
p, q = getPrime(1024), getPrime(1024)
while ((p-1)*(q-1)) % e == 0 :
    p, q = getPrime(1024), getPrime(1024)
N = p*q

print("=== ICEDTEA Verifier 1.0 ===")

while True:
    OTP = getrandbits(SIZE)
    print(f"signed: {pow(OTP, e, N)}")
    TRIAL = int(input("OTP: "))
    if TRIAL == OTP:
        print(f"signed: {pow(FLAG, e, N)}")
        continue
        
    print(f"Invalid OTP, {OTP}")
```

To get the flag we need to do a two things. First we need to input the correct OTP, then we need to decrypt the RSA signed flag

## Vulnerability

The first vulnerability lies in using pythons `getrandbits` functions. Since pythons random library uses a Mersenne Twister we are able to predict the next input given a few inputs. We can use any Mersenne Twister cracker libarary in python like [this](https://github.com/Mistsuu/randcracks)

The second lies in being able to connect to the instance multiple times with different values of N. First we can get N from the multiple signed OTPs. Then we can do a [Håstad's broadcast attack](https://en.wikipedia.org/wiki/Coppersmith%27s_attack#H.C3.A5stad.27s_broadcast_attack) to recover the signed flag

## Exploit
```python
import math
from pwn import *
from mt19937_crack import RandomSolver
from Crypto.Util.number import *
from sympy.ntheory.modular import crt
import gmpy2

e=37
def getnextguess(l):
    randomSolver = RandomSolver()
    for i in l:
        randomSolver.submit_getrandbits(i, 64)
    return randomSolver

Nlist = []
flaglist = []

for _ in range(10):
    io = remote('160.187.199.7', 31337)

    io.recvline().decode() # get the introduction line

    #Set up lists for otps and calculating the N val
    otps = []
    ns = []

    for i in range(312):

        o = io.recvline()
        c = int(o.decode().split(':')[1].strip(" \n'")) # get the signed otp

        io.sendline(b"1")

        o = io.recvline()
        num = int(o.decode().split(',')[1].strip(" \n'")) # get the real otp

        otps.append(num)

        m = pow(num, e) - c
        ns.append(m)


    # Now we can find the N using the multiple signed OTPs
    N_candidate = ns[0]
    for i in range(1, len(ns)):
        N_candidate = math.gcd(N_candidate, ns[i])
    Nlist.append(N_candidate)

    s = getnextguess(otps)
    s.solve()

    io.recvline()
    io.sendline(str(s.getrandbits(64)).encode()) # Send the predicted OTP

    o = io.recvline()
    encrypted_flag = int(o.decode().split(':')[2].strip(" \n'"))

    flaglist.append(encrypted_flag)
    io.close()

    # Use chinese remainder theorem to get the flag using the values so far
    C, _ = crt(Nlist, flaglist) 
    m_recovered, exact = gmpy2.iroot(C, e)
    print(long_to_bytes(m_recovered))
```

After running this code for a few minutes we can get our flag like so

```
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b'\x94\xde\xa7lU\x14\xad'
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b'a\x82Q\x04\xbb.\xe9\x98\x1a\xe7\xa6\xca\x88\xbd'
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b';U\x82T\x85\xf2 \x86Z\x10\xfa\xdb\x1e\xc2\xd2%\xd9\xb0e)+'
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b"'\xf1\xa2\x04\x91\xc6\xd8\x88(\x11\xad\xb1\xd4N*I\xc2$\xed\xa1J\x7f\x87w|\x03\xcb\xb1"
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b'\x186\x9d\xad\xcf\x8c\xbf\x01\xa8N\xe7}\xfa\xa6\x1b\x18N&}\xc11\xd4o\x9a\xb2HP\xab\x8d$\x0f\xb8\xb1<\xa3'
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b'\x0f\xb63\x8e\xc5\xb4\xa4K\xd88\x89\xc4\x17Ft\x86i\x0b\xb0\x8a>\x18\xb5R\x8d\x05\xac\xa7\xe3\xe9\xae\x02Bw\xf4\xbf\x08\x0f\r\xfc\xba\r'
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b'\t\xe4@\x03\x996\xe1\xc3\x0f\x8a\xd5\x80I\x0e\xb0\xb2o\x83\x8e9\xb1\x19\x93\xc9\xb6\xec<D\x16g/l\xf8\x81\xdco\xfc\xb4j(\xefJ\xcd\xa8+A}\xe9\xd6'
[+] Opening connection to 160.187.199.7 on port 31337: Done
[*] Closed connection to 160.187.199.7 port 31337
b'NHNC{using_big_intergers_in_python_is_still_a_pain}'
```

## Conclusion

Don't use pythons random library for OTPs since it can be predicted. Don't let users get the same encrypted message with the same N or else it can be revealed.
