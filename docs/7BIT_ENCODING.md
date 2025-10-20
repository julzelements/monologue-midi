# 7-Bit MIDI Encoding Explained

## The Problem

MIDI SysEx messages require all data bytes to be 7-bit values (0-127), meaning bit 7 must always be 0. However, we need to transmit 8-bit data (0-255). The solution is to pack the data.

## The Solution

For every 7 bytes of 8-bit data, we create 8 bytes of 7-bit MIDI data:

- **Byte 0**: Contains all the high bits (bit 7) from the 7 data bytes
- **Bytes 1-7**: Contain the lower 7 bits from each data byte

## Visual Representation

### Before Encoding (7 bytes of 8-bit data)

Each row represents one byte with 8 bits:

| Byte  | b7  | b6  | b5  | b4  | b3  | b2  | b1  | b0  |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- |
| **0** | 🟣1 | 🟣2 | 🟣3 | 🟣4 | 🟣5 | 🟣6 | 🟣7 | 🟣8 |
| **1** | 🔵1 | 🔵2 | 🔵3 | 🔵4 | 🔵5 | 🔵6 | 🔵7 | 🔵8 |
| **2** | 🟢1 | 🟢2 | 🟢3 | 🟢4 | 🟢5 | 🟢6 | 🟢7 | 🟢8 |
| **3** | 🟡1 | 🟡2 | 🟡3 | 🟡4 | 🟡5 | 🟡6 | 🟡7 | 🟡8 |
| **4** | 🟠1 | 🟠2 | 🟠3 | 🟠4 | 🟠5 | 🟠6 | 🟠7 | 🟠8 |
| **5** | 🟤1 | 🟤2 | 🟤3 | 🟤4 | 🟤5 | 🟤6 | 🟤7 | 🟤8 |
| **6** | 🔴1 | 🔴2 | 🔴3 | 🔴4 | 🔴5 | 🔴6 | 🔴7 | 🔴8 |

### After Encoding (8 bytes of 7-bit MIDI data)

The high bits are packed into byte 0, and bytes 1-7 contain the lower 7 bits:

| Byte  | b7   | b6  | b5  | b4  | b3  | b2  | b1  | b0  | Description          |
| ----- | ---- | --- | --- | --- | --- | --- | --- | --- | -------------------- |
| **0** | ⚪️0 | 🟣1 | 🔵1 | 🟢1 | 🟡1 | 🟠1 | 🟤1 | 🔴1 | **Packed high bits** |
| **1** | ⚪️0 | 🟣2 | 🟣3 | 🟣4 | 🟣5 | 🟣6 | 🟣7 | 🟣8 | Byte 0 lower 7 bits  |
| **2** | ⚪️0 | 🔵2 | 🔵3 | 🔵4 | 🔵5 | 🔵6 | 🔵7 | 🔵8 | Byte 1 lower 7 bits  |
| **3** | ⚪️0 | 🟢2 | 🟢3 | 🟢4 | 🟢5 | 🟢6 | 🟢7 | 🟢8 | Byte 2 lower 7 bits  |
| **4** | ⚪️0 | 🟡2 | 🟡3 | 🟡4 | 🟡5 | 🟡6 | 🟡7 | 🟡8 | Byte 3 lower 7 bits  |
| **5** | ⚪️0 | 🟠2 | 🟠3 | 🟠4 | 🟠5 | 🟠6 | 🟠7 | 🟠8 | Byte 4 lower 7 bits  |
| **6** | ⚪️0 | 🟤2 | 🟤3 | 🟤4 | 🟤5 | 🟤6 | 🟤7 | 🟤8 | Byte 5 lower 7 bits  |
| **7** | ⚪️0 | 🔴2 | 🔴3 | 🔴4 | 🔴5 | 🔴6 | 🔴7 | 🔴8 | Byte 6 lower 7 bits  |

## Concrete Example

Let's encode 7 bytes of real data:

### Input Data (8-bit bytes)

```
Byte 0: 0b10000001 (0x81) = 129
Byte 1: 0b00000010 (0x02) = 2
Byte 2: 0b10000100 (0x84) = 132
Byte 3: 0b00001000 (0x08) = 8
Byte 4: 0b10010000 (0x90) = 144
Byte 5: 0b00100000 (0x20) = 32
Byte 6: 0b11000000 (0xC0) = 192
```

### Encoding Process

**Step 1**: Extract high bits (bit 7) from each byte:

- Byte 0: `1`, Byte 1: `0`, Byte 2: `1`, Byte 3: `0`, Byte 4: `1`, Byte 5: `0`, Byte 6: `1`

**Step 2**: Pack high bits into first output byte:

```
Packed byte = 0b0_1010101 = 0x55
              └─ MIDI bit (always 0)
               └─────────── High bits: 1,0,1,0,1,0,1
```

**Step 3**: Copy lower 7 bits to remaining bytes:

```
Byte 1: 0b0_0000001 (0x01) ← lower 7 bits of 0x81
Byte 2: 0b0_0000010 (0x02) ← lower 7 bits of 0x02
Byte 3: 0b0_0000100 (0x04) ← lower 7 bits of 0x84
Byte 4: 0b0_0001000 (0x08) ← lower 7 bits of 0x08
Byte 5: 0b0_0010000 (0x10) ← lower 7 bits of 0x90
Byte 6: 0b0_0100000 (0x20) ← lower 7 bits of 0x20
Byte 7: 0b0_1000000 (0x40) ← lower 7 bits of 0xC0
```

### Encoded Output (7-bit MIDI bytes)

```
[0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40]
```

All bytes are now ≤ 127 and MIDI-compliant! ✅

## In the Monologue Context

The Korg Monologue uses this encoding for its entire SysEx dump:

- **Raw data**: 448 bytes (7 bytes × 64 sets)
- **MIDI encoded**: 512 bytes (8 bytes × 64 sets)
- **Complete SysEx**: 520 bytes (7-byte header + 512-byte payload + 1-byte footer)
