---
title: GoldenByte

published: 2025-07-02

description: Finding the golden value

tags: [pwn, gdb, decompiler]

category: Junior.Crypt.2025
---

# GoldenByte

## Files

We have one file `GoldenByte: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=5365347daaf3af6f6681afe94cbab95355b3ad8c, for GNU/Linux 3.2.0, not stripped`

Running the file gives us 

```
--- 'Golden Byte' Lottery ---
Ready to test your luck? Enter your lottery ticket number: > 123

Checking ticket number 123...
Sorry, your ticket didn't win. Better luck next time!
```

## Getting the flag

Looking at the gdb assembly and some debugging

```
   0x0000000000001289 <+133>:   movzx  eax,WORD PTR [rbp-0x4]
   0x000000000000128d <+137>:   cmp    ax,0xfde9
   0x0000000000001291 <+141>:   jne    0x12a9 <main+165>
   0x0000000000001293 <+143>:   movzx  eax,WORD PTR [rbp-0x2]
   0x0000000000001297 <+147>:   cmp    ax,0xbee0
```

We can see that its comparing our input to a specific value so all we need is to input that value

So our value needs to be `0xbee0fde9` which is `3202416105`

We submit that to the server and get our flag

```
--- 'Golden Byte' Lottery ---
Ready to test your luck? Enter your lottery ticket number: > 3202416105

Checking ticket number -1092551191...
grodno{D4dy4_m4TV31_Pr019r4l_kV4rT1RY_V_K421n0_V3D_n3_2N4L_PWN}
```
