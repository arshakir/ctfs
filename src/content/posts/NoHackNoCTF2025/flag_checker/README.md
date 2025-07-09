---
title: flag checker

published: 2025-07-08

description: Reversing C binary

tags: [rev, C, decompiler]

category: No Hack No CTF 2025
---

# flag checker 
> You are doing a mission and you need to find out the secret

## Binary File:

The challenge gives us a single c binary file

Opening this up in decompiler gives us

```c
  __isoc99_scanf("%255s", &var_118h);
  cVar1 = fcn.0000123e((int64_t)&var_118h);
  if (cVar1 == '\0') {
      puts("Incorrect flag :(");
  } else {
      puts("Correct! You may submit the flag now :)");
  }
```

Basically the code takes our input, puts it into a function that checks if its the flag and then tells us. But to see how it checks our flag we need to look at the decompiled function

```c
uVar1 = fcn.00001189(0x420fe9e1);
    uVar1 = fcn.0000120d((uint64_t)uVar1, 1);
    if (uVar1 - 0x27 == (int32_t)*(char *)(arg1 + 5)) {
        iVar2 = fcn.00001189((uint64_t)(uint32_t)((float)(int32_t)*(char *)arg1 * 3.1415));
        if (iVar2 == 0xf5) {
            uVar1 = fcn.00001189(0x406ccccd);
            uVar1 = fcn.000011dc((uint64_t)uVar1, 7);
            if (uVar1 - 0x4c == (int32_t)*(char *)(arg1 + 0x2c)) {
                uVar3 = fcn.0000119d(0x3f800000);
                if ((uVar3 >> 0x18) + 0x20 == (int32_t)*(char *)(arg1 + 0x13)) {
                    uVar1 = fcn.00001189(0x42b16c22);
                    uVar1 = fcn.0000120d((uint64_t)uVar1, 4);
```

The flag checker functions literally just takes each character of our flag and checks it against some value. However, we cant really see this value since its covered up by math

## Reversing the flag

What we can do is open it up in gdb and follow along to see what each of our characters need to be

For example:

```
   0x555555555276                  add    rax, 0x5
   0x55555555527a                  movzx  eax, BYTE PTR [rax]
   0x55555555527d                  movsx  eax, al
 → 0x555555555280                  cmp    edx, eax
   0x555555555282                  je     0x55555555528e
   0x555555555284                  mov    eax, 0x0
   0x555555555289                  jmp    0x555555555d97
   0x55555555528e                  mov    rax, QWORD PTR [rbp-0x8]
   0x555555555292                  movzx  eax, BYTE PTR [rax]
```

```
(gdb) p $edx
$1 = 0x6a
```

This basically means that our `flag_input[5]` must be equal to the `0x6a` which is the character j

Now we just continue the process stopping at each cmp instruction to check what our value should be

Most of them are all the same but there was one that uses its runs some math on the input and checks against the input. We could use algebra to solve it or just leave it blank and figure it out based on the other characters

If we keep doing this for a long time we eventually get our flag `NHNC{jus7_s0m3_c00l_flo4t1ng_p0in7_0p3ra7ion5}`
