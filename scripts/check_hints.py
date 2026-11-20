import json

with open('levels_data.json') as f:
    d = json.load(f)

hints = {
    'flash\\booksort04b.swf': 'Hint: Dimulakan dengan buku kuning. Diakhiri dengan buku hijau',
    'flash\\booksort04c.swf': 'Hint: Dimulakan dengan 2 buku biru. Diakhiri dengan "x"',
    'flash\\booksort04d.swf': 'Hint: HB,HC,HD..',
    'flash\\booksort04e.swf': 'Hint: Nombor lebih utama dari titik perpuluhan. Diakhiri dengan buku kuning',
    'flash\\booksort04f.swf': 'Hint: Buku kelabu ditengah-tengah.',
    'flash\\booksort04g.swf': 'Hint: A6 sebelum A7.',
    'flash\\booksort04h.swf': 'Hint: B2x lebih utama dari B23. Abaikan "Urblib"',
    'flash\\booksort04i.swf': 'Hint: Dimulakan dengan buku hijau. Diakhiri dengan buku kuning',
    'flash\\booksort04j.swf': 'Hint: Anda mampu selesaikan sendiri..',
    'flash\\booksort04k.swf': 'Hint: Kacang..'
}

for k, h in sorted(hints.items()):
    print('==============================')
    print(k, '|', h)
    books = d[k]
    by_slot = sorted(books, key=lambda x: x['slot'])
    for b in by_slot:
        print(f"  Slot {b['slot']}: [{b['color']['name']} / {b['color']['color']}] {b['text']} (Book {b['book_id']})")
