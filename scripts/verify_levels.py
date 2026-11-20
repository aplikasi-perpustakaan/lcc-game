import glob, struct, re, json

class BitReader:
    def __init__(self, data, offset=0):
        self.data = data
        self.byte_pos = offset
        self.bit_pos = 0
    def read_bit(self):
        b = (self.data[self.byte_pos] >> (7 - self.bit_pos)) & 1
        self.bit_pos += 1
        if self.bit_pos == 8:
            self.bit_pos = 0
            self.byte_pos += 1
        return b
    def read_bits(self, n):
        val = 0
        for _ in range(n):
            val = (val << 1) | self.read_bit()
        return val
    def read_sbits(self, n):
        if n == 0: return 0
        val = self.read_bits(n)
        if val & (1 << (n - 1)):
            val -= (1 << n)
        return val
    def byte_align(self):
        if self.bit_pos != 0:
            self.bit_pos = 0
            self.byte_pos += 1

def read_rect(br):
    nb = br.read_bits(5)
    xmin = br.read_sbits(nb)
    xmax = br.read_sbits(nb)
    ymin = br.read_sbits(nb)
    ymax = br.read_sbits(nb)
    br.byte_align()
    return (xmin, xmax, ymin, ymax)

def read_matrix(br):
    has_scale = br.read_bit()
    if has_scale:
        n_scale_bits = br.read_bits(5)
        scale_x = br.read_sbits(n_scale_bits)
        scale_y = br.read_sbits(n_scale_bits)
    has_rotate = br.read_bit()
    if has_rotate:
        n_rot_bits = br.read_bits(5)
        rot_skew0 = br.read_sbits(n_rot_bits)
        rot_skew1 = br.read_sbits(n_rot_bits)
    n_trans_bits = br.read_bits(5)
    trans_x = br.read_sbits(n_trans_bits)
    trans_y = br.read_sbits(n_trans_bits)
    br.byte_align()

def parse_swf_texts(data):
    nb = data[8] >> 3
    pos = 8 + ((5 + nb * 4 + 7) // 8) + 4
    font_chars = {}
    texts = []
    
    while pos < len(data):
        th = struct.unpack('<H', data[pos:pos+2])[0]
        pos += 2
        tt = th >> 6
        tl = th & 0x3F
        if tl == 0x3F:
            tl = struct.unpack('<I', data[pos:pos+4])[0]
            pos += 4
        td = data[pos:pos+tl]
        pos += tl
        
        if tt == 13:
            fid = struct.unpack('<H', td[:2])[0]
            nl = td[2]
            flags = td[3+nl]
            tbl = td[4+nl:]
            wide = bool(flags & 1)
            if wide:
                chars = [chr(struct.unpack('<H', tbl[i:i+2])[0]) for i in range(0, len(tbl), 2)]
            else:
                chars = [chr(b) for b in tbl]
            font_chars[fid] = chars
        elif tt in (11, 33):
            tid = struct.unpack('<H', td[:2])[0]
            br = BitReader(td, 2)
            read_rect(br)
            read_matrix(br)
            glyph_bits = td[br.byte_pos]
            advance_bits = td[br.byte_pos + 1]
            br.byte_pos += 2
            cur_font = None
            extracted = []
            while br.byte_pos < len(td):
                b = td[br.byte_pos]
                if b == 0: break
                br.byte_pos += 1
                has_font = bool(b & 8)
                has_color = bool(b & 4)
                has_y = bool(b & 2)
                has_x = bool(b & 1)
                if has_font:
                    cur_font = struct.unpack('<H', td[br.byte_pos:br.byte_pos+2])[0]
                    br.byte_pos += 2
                if has_color: br.byte_pos += 4 if tt == 33 else 3
                if has_x: br.byte_pos += 2
                if has_y: br.byte_pos += 2
                if has_font: br.byte_pos += 2
                glyph_count = td[br.byte_pos]
                br.byte_pos += 1
                for _ in range(glyph_count):
                    g_idx = br.read_bits(glyph_bits)
                    adv = br.read_sbits(advance_bits)
                    if cur_font in font_chars and g_idx < len(font_chars[cur_font]):
                        extracted.append(font_chars[cur_font][g_idx])
                    else:
                        extracted.append('?')
                br.byte_align()
            texts.append((tid, ''.join(extracted)))
    return texts

def get_color_scheme(r, g, b):
    # Determine color classification
    if r > 180 and g > 150 and b < 130:
        return {
            'name': 'kuning',
            'color': 'yellow',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #fcd34d 0%, #eab308 50%, #ca8a04 100%)',
            'border': '#a16207',
            'spine': '#854d0e',
            'text_color': '#1f2937'
        }
    if r > 180 and g > 130 and b > 70 and b < 130:
        return {
            'name': 'kuning',
            'color': 'yellow',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #fed7aa 0%, #fba94b 50%, #d97706 100%)',
            'border': '#b45309',
            'spine': '#92400e',
            'text_color': '#1f2937'
        }
    if b > 140 and r < 120:
        return {
            'name': 'biru',
            'color': 'blue',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)',
            'border': '#1e40af',
            'spine': '#172554',
            'text_color': '#ffffff'
        }
    if r < 110 and g > 140 and b > 140:
        return {
            'name': 'biru/teal',
            'color': 'teal',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #5eead4 0%, #0d9488 50%, #115e59 100%)',
            'border': '#134e4a',
            'spine': '#042f2e',
            'text_color': '#ffffff'
        }
    if g > 130 and r < 150 and b < 100:
        return {
            'name': 'hijau',
            'color': 'green',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%)',
            'border': '#166534',
            'spine': '#14532d',
            'text_color': '#ffffff'
        }
    if g > 110 and r > 110 and b < 50:
        # olive / yellow-green
        return {
            'name': 'hijau',
            'color': 'green',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #bef264 0%, #65a30d 50%, #4d7c0f 100%)',
            'border': '#3f6212',
            'spine': '#1a2e05',
            'text_color': '#ffffff'
        }
    if r > 120 and g < 70 and b < 80:
        return {
            'name': 'merah',
            'color': 'red',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #f87171 0%, #dc2626 50%, #991b1b 100%)',
            'border': '#7f1d1d',
            'spine': '#450a0a',
            'text_color': '#ffffff'
        }
    if abs(r - g) < 25 and abs(g - b) < 25:
        return {
            'name': 'kelabu',
            'color': 'grey',
            'hex': f'#{r:02x}{g:02x}{b:02x}',
            'bg': 'linear-gradient(135deg, #cbd5e1 0%, #64748b 50%, #475569 100%)',
            'border': '#334155',
            'spine': '#1e293b',
            'text_color': '#ffffff'
        }
    return {
        'name': 'coklat',
        'color': 'brown',
        'hex': f'#{r:02x}{g:02x}{b:02x}',
        'bg': 'linear-gradient(135deg, #fdba74 0%, #c2410c 50%, #9a3412 100%)',
        'border': '#7c2d12',
        'spine': '#431407',
        'text_color': '#ffffff'
    }

def parse_full_accurate(fn):
    with open(fn, 'rb') as f:
        data = f.read()
    texts = parse_swf_texts(data)
    book_texts = [t[1] for t in texts[:5]]
    
    nb = data[8] >> 3
    pos = 8 + ((5 + nb * 4 + 7) // 8) + 4
    btn30_act = []
    shapes = {}
    btn_shapes = {}
    btn_to_book = {}
    
    while pos < len(data):
        th = struct.unpack('<H', data[pos:pos+2])[0]
        pos += 2
        tt = th >> 6
        tl = th & 0x3F
        if tl == 0x3F:
            tl = struct.unpack('<I', data[pos:pos+4])[0]
            pos += 4
        td = data[pos:pos+tl]
        pos += tl
        
        if tt in (2, 22, 32):
            sid = struct.unpack('<H', td[:2])[0]
            br = BitReader(td, 2)
            read_rect(br)
            cnt = td[br.byte_pos]
            br.byte_pos += 1
            if cnt == 255:
                cnt = struct.unpack('<H', td[br.byte_pos:br.byte_pos+2])[0]
                br.byte_pos += 2
            fst = td[br.byte_pos]
            br.byte_pos += 1
            if fst in (0x10, 0x12):
                read_matrix(br)
                num_g = td[br.byte_pos]
                br.byte_pos += 1
                r, g, b = td[br.byte_pos+1:br.byte_pos+4]
                shapes[sid] = (r, g, b)
            elif fst == 0:
                r, g, b = td[br.byte_pos:br.byte_pos+3]
                shapes[sid] = (r, g, b)
        elif tt == 34:
            bid = struct.unpack('<H', td[:2])[0]
            act_off = struct.unpack('<H', td[3:5])[0]
            rec_data = td[5:3+act_off]
            if len(rec_data) >= 3:
                shape_cid = struct.unpack('<H', rec_data[1:3])[0]
                btn_shapes[bid] = shape_cid
            if act_off != 0:
                act_strs = [x.decode('latin1') for x in re.findall(rb'[\x20-\x7E]{2,}', td[3+act_off:])]
                if bid == 30:
                    btn30_act = act_strs
                else:
                    for s in act_strs:
                        m = re.match(r'^/Book\s*([1-5])$', s)
                        if m:
                            btn_to_book[bid] = int(m.group(1))
                            break

    b_slots = {}
    for i, token in enumerate(btn30_act):
        m = re.match(r'^Book\s*([1-5])$', token)
        if m and i + 1 < len(btn30_act):
            b_num = int(m.group(1))
            pval = float(btn30_act[i+1])
            slot = 1
            if abs(pval - 29.3) < 2: slot = 1
            elif abs(pval - 83.5) < 2: slot = 2
            elif abs(pval - 137.6) < 25: slot = 3
            elif abs(pval - 191.8) < 2: slot = 4
            elif abs(pval - 245.9) < 2: slot = 5
            b_slots[b_num] = slot

    book_to_btn = {v: k for k, v in btn_to_book.items()}
    if 'booksort04a' in fn:
        book_nums = [1, 2, 3, 4, 5]
    else:
        book_nums = [2, 3, 4, 5, 1]

    books = []
    for i, b_num in enumerate(book_nums):
        bid = book_to_btn.get(b_num)
        sid = btn_shapes.get(bid)
        rgb = shapes.get(sid, (128, 128, 128))
        color_scheme = get_color_scheme(*rgb)
        books.append({
            'book_id': b_num,
            'text': book_texts[i],
            'slot': b_slots.get(b_num, 0),
            'color': color_scheme
        })
    return books

output = {}
for fn in sorted(glob.glob('flash/*.swf')):
    output[fn] = parse_full_accurate(fn)

with open('levels_data.json', 'w') as f:
    json.dump(output, f, indent=2)

print("Updated levels_data.json successfully")
