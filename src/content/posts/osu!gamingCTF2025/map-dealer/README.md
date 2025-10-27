---
title: map-dealer

published: 2025-10-27

description: Finding hidden deleted files in usb drive

tags: [forensics, sleuthkit, deleted files]
category: osu! gaming CTF 2025
---

# map dealer
> We have confiscated a USB drive from sahuang, whom we were informed was trying to sell a beatmap containing some confidential data of the community to the dark web. However, the beatmap was nowhere to be found from the drive when we mounted it to our computer. Can you help recover it?


## File

From the challenge we get a file

```
❯ file *
SanDisk.E01: EWF/Expert Witness/EnCase image file format
```

Based on the clues we know that this was a usb drive file that probably has some deleted data

We can use sleuthkit `fls` to list the files that are in the drive:

```
❯ fls SanDisk.E01
r/r 8195:       SanDisk (Volume Label Entry)
r/r 8196:       $ALLOC_BITMAP
r/r 8197:       $UPCASE_TABLE
d/d 8198:       System Volume Information
r/r * 8202:     sahuang - secret map.osz
v/v 3911034883: $MBR
v/v 3911034884: $FAT1
V/V 3911034885: $OrphanFiles
```
We see that there is a secret map file so lets extract that with `icat SanDisk.E01 8202 > "sahuang - secret map.osz"`

Now if you have ever played osu you know that the `.osz` files are actually just zip files we can unzip this and look at the contents

```
❯ unzip sahuang\ -\ secret\ map.osz
Archive:  sahuang - secret map.osz
  inflating: audio.MP3
  inflating: flag.png
  inflating: sahuang - secret map (hollow) [flag{osu_is_really_fun!}].osu
```

Now got the flag.png all we do is open it up and get the flag:

![flag.png](flag.png)
