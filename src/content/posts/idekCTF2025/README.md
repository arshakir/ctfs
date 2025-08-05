---
title: Lazy VM 

published: 2025-08-04

description: reverse engineering a custom assembly language

tags: [rev, VM, assembly]
category: idekCTF 2025
---

# Lazy VM
> I was too ~~lazy~~ busy to code a CTF challenge myself, so I hired a freelancer online for just $5 to take care of it. However, when I received the work, the quality was far below expectations. Deciding not to pay for the poor-quality challenge, I refused to settle the debt. Frustrated, the freelancer left the challenge running online, refusing to hand it over or shut it down.
> All I know is that it’s a virtual machine challenge, and the flag.txt file is located in the same folder as the challenge. Beyond that, I have no idea how the challenge works
> nc lazy-vm.chal.idek.team 1337

## The Challenge

After connecting to the challenge we get a prompt for `Please enter your code:` with not alot of explanation

Sending some input like `hi` we get an output saying `Unknown instruction at ip=0x0`

Now this gives us some clues. We need to enter some assembly instructions that will open the flag. Only problem is that we dont know what assembly instructions we can use

After playing around some more we find that certain characters give us `Found a forbidden character. Exit` while most are Unknown instructions

But we find the character `i` outputs something else

```
============== REGISTER ==================
R0 = 0x0
R1 = 0x0
R2 = 0x0
R3 = 0x0
R4 = 0x0
R5 = 0x0
R6 = 0x0
R7 = 0x0
ip: 0x0
sp: 0x64
=================== STACK =====================
0x0
0x0
0x0
0x0
0x0
=================== MEMORY =====================
The pay is only $5. Too lazy to implement this
Unknown instruction at ip=0x1
```

Sending the instruction `i` gives us a dump of the registers and stack and now we can finally get somewhere

But how to send actual code. Rather than typing assembly instruction we need to send op codes using hex

If we send something like `0x0` or `0x1` to the vm using `printf "\x01" | nc lazy-vm.chal.idek.team 1337` we actuall get `Thanks for playing` rather than an unknown instruction

So now all we need to do is find the opcodes that will open and read the contents of the flag


## Finding the opcodes

Most of the opcodes can be found by just trying stuff until something happens

We can figure out the arguments by adding i after the code eg `0x01iii` and seeing how many debug outputs we get

It also tells us if an argument is a reg since it will be out of range (i becomes 0x69)

I will give a description of all the codes so the final solution makes sense

### opcode 0

I think this one just quits.

### opcode 1

`\x01\xnn`

Pushes the value of nn onto the stack

### opcode 2

`\x02\xreg`

Pops the stack onto the reg argument

### opcode 3

`\x03\xreg`

Pushes the value in reg onto the stack

### opcode 4

`\x04\xreg`

Copies the value in reg into R0 i think probbaly idk

### opcode 5

`\x05\xreg`

Bitwise xor the value in reg with R0 and saves to R0 

### opcode 6

`\x06\xreg\xnn`

Copies the value located at memory position nn into reg. i think i didnt test this

### opcode 7

`\x07\xnn\xreg`

Stores the value in reg onto the memory position nn

### opcode 8

`\x08`

Executes the syscall determined by value in R0 reg and arguments in the other registers


## Syscalls

### Syscall 0

This is the syscall for `read`, arguments below

```
R0 = 0
R1 = fd
R2 = mempos
R3 = numbytes
```

We can find this out by messing around with the arguments. if it reads too many bytes (outside of 0-0x64) it throws `syscall read: memory out of range`

### Syscall 1

This is the syscall for `write`, arguments below

```
R0 = 1
R1 = fd
R2 = mempos
R3 = numbytes
```

Same thing if we write outside of the memory we get `syscall write: memory out of range`

### Syscall 2

`open` syscall

```
R0 = 2
R1 = filename in mem 
R2 = flags? 
```

We find this by seting a big number to R2 which gives us an error of `syscall open: unknown flag`

If the syscall was successful fd is set in R0, else its set to 0xFF

## Approach

We can use the 3 syscalls to read the contents of flag.txt

First we need to put flag.txt into the memory

Then we can call open using the filename in mem

Then we read the contents and save it back to mem

Finally we write the contents of mem to stdout and get our flag

### Loading flag.txt into mem

This is probably the hardest part because the characters `flag` are forbidden by the VM

To get around this we can input the bitwise not of each character and then use the xor opcode to turn it back into the flag

The payload would look like this:

use opcode 1 put `0xFF` into stack -> use opcode 2 put it into reg0 

use opcode 1 put `~f` into stack -> use opcode 2 put into reg1

use opcode 5 on reg1 (does bitwise not on `~f` so `f` is in reg0) -> use opcode7 to save reg0 to the ith mempos

Repeat for all characters

We can write a python function to do this for us shown in the final solution

### Call open

This is pretty simple just:

Use opcodes 1 and 2 to load each value into the registers that arent already 0

syscall = R0 = 2, mempos = R1 = 0, flags = R2 = 0

Execute the syscall, the value in R0 should be 0 to indicate it worked

### Call read

syscall = R0 = 0, fd = R1 = prevR0 = 0, mempos = R2 = 0, numbytes = R3 = 64

Execute the syscall and the memory should be updated now we just have to print it

### Call write

syscall = R0 = 1, fd = R1 = 1 (for stdout), mempos = R2 = 0, numbytes = R3 = 64


## Solution
Now we put all of this together into one solution

```python
from pwn import *

def encode_message(s):
    payload = b'\x01\xff\x02\x00' # Set R0 to 0xFF
    for i,c in enumerate(s):
        notc = ~ord(c) & 0xFF # Get bitwise not of c

        # push notc into stack, move notc into R1, execute not saved to R0, save R0 to its location in mem, reload 0xFF into R0
        payload += b'\x01' + bytes([notc]) + b'\x02\x01' + b'\x05\x01' + b'\x07' + (bytes([i])) + b'\x00' + b'\x01\xff\x02\x00'

    return payload

payload = encode_message('flag.txt') # Dumps flag.txt into mem starting at 0


#            Set R0 to 2         Set R1 to 0            Execute syscall
payload += b'\x01\x02\x02\x00' + b'\x01\x00\x02\x01' + b'\x08' # $R0 = fd = open("flag.txt")

#           Set R3 to 0x64 and execute syscall
payload += b'\x01\x64\x02\x03i\x08i' # read(fd=0, mem=0, numbytes=64)

#            Set R0 to 1            Set R1 = fd = 1     Use prev args (mem=0, numbytes=0x64) and execute syscall
payload += b'\x01\x01\x02\x00' + b'\x01\x01\x02\x01' + b'\x08' # write(fd = 1, mem=0, numbytes=64) dumps entire memory

p = remote('lazy-vm.chal.idek.team', 1337)
p.send(payload)
p.interactive()
```

Running this we get our flag `idek{Th15_I$_thE_L@Z13$t_vM_i_h4vE_EvEr_5EEN}`

