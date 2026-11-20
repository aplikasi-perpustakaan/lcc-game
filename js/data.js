/**
 * LCC Game - Data Soalan & Konfigurasi Tahap
 * Sistem Pengkelasan Library of Congress (LCC)
 */

const LCC_LEVELS = [
  {
    "id": 1,
    "title": "Tahap 1",
    "code": "booksort04b",
    "hint": "Dimulakan dengan buku kuning. Diakhiri dengan buku hijau",
    "explanation": "Kelas HQ72 mendahului HQ73. Nombor pengarang (Cutter) .A18 mendahului .A2 (.18 < .20). Salinan 'c.2' menyusul selepas karya asas, diikuti edisi tahun 1988 bagi salinan 2.",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "HQ72.A2c.2",
        "initialSlot": 1,
        "targetSlot": 3,
        "color": {
          "name": "kelabu",
          "bg": "linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)",
          "border": "#374151",
          "spine": "#1f2937",
          "textColor": "#ffffff"
        },
        "lines": [
          "HQ",
          "72",
          ".A2",
          "c.2"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "HQ73.A19G3",
        "initialSlot": 2,
        "targetSlot": 5,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "HQ",
          "73",
          ".A19",
          "G3"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "HQ72.A2",
        "initialSlot": 3,
        "targetSlot": 2,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)",
          "border": "#1e40af",
          "spine": "#172554",
          "textColor": "#ffffff"
        },
        "lines": [
          "HQ",
          "72",
          ".A2"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "HQ72.A18",
        "initialSlot": 4,
        "targetSlot": 1,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%)",
          "border": "#a16207",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "HQ",
          "72",
          ".A18"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "HQ72.A2c.21988",
        "initialSlot": 5,
        "targetSlot": 4,
        "color": {
          "name": "merah",
          "bg": "linear-gradient(180deg, #f87171 0%, #dc2626 60%, #991b1b 100%)",
          "border": "#7f1d1d",
          "spine": "#450a0a",
          "textColor": "#ffffff"
        },
        "lines": [
          "HQ",
          "72",
          ".A2",
          "c.2",
          "1988"
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "Tahap 2",
    "code": "booksort04c",
    "hint": "Dimulakan dengan 2 buku biru. Diakhiri dengan \"x\"",
    "explanation": "Subkelas Q284.2 mendahului Q284.3. Dalam Q284.2, nombor Cutter disusun secara perpuluhan: .L94 < .R17 < .R2 (.17 < .20). Pada Q284.3, nombor berhuruf penanda 'x' diletakkan di hujung selepas edisi piawai.",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "Q284.3.K94",
        "initialSlot": 1,
        "targetSlot": 4,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "Q",
          "284.3",
          ".K94"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "Q284.3.K94x",
        "initialSlot": 2,
        "targetSlot": 5,
        "color": {
          "name": "teal",
          "bg": "linear-gradient(180deg, #5eead4 0%, #0d9488 60%, #115e59 100%)",
          "border": "#134e4a",
          "spine": "#042f2e",
          "textColor": "#ffffff"
        },
        "lines": [
          "Q",
          "284",
          ".3",
          ".K94x"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "Q284.2.R17",
        "initialSlot": 3,
        "targetSlot": 2,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)",
          "border": "#1e40af",
          "spine": "#172554",
          "textColor": "#ffffff"
        },
        "lines": [
          "Q",
          "284",
          ".2",
          ".R17"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "Q284.2.R2",
        "initialSlot": 4,
        "targetSlot": 3,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fed7aa 0%, #fba94b 60%, #d97706 100%)",
          "border": "#b45309",
          "spine": "#78350f",
          "textColor": "#1f2937"
        },
        "lines": [
          "Q",
          "284.2",
          ".R2"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "Q284.2.L94",
        "initialSlot": 5,
        "targetSlot": 1,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #93c5fd 0%, #60a5fa 60%, #2563eb 100%)",
          "border": "#1d4ed8",
          "spine": "#1e3a8a",
          "textColor": "#ffffff"
        },
        "lines": [
          "Q",
          "284.2",
          ".L94"
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "Tahap 3",
    "code": "booksort04d",
    "hint": "HB,HC,HD..",
    "explanation": "Susunan abjad kod kelas subjek: HB mendahului HC, dan HC mendahului HD. Dalam kelas yang sama, susunan mengikut nombor bulat kelas (102 sebelum 103; 97 sebelum 101).",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "HB103.B5",
        "initialSlot": 1,
        "targetSlot": 2,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%)",
          "border": "#a16207",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "HB",
          "103",
          ".B5"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "HD97.A33",
        "initialSlot": 2,
        "targetSlot": 4,
        "color": {
          "name": "teal",
          "bg": "linear-gradient(180deg, #67e8f9 0%, #06b6d4 60%, #0e7490 100%)",
          "border": "#155e75",
          "spine": "#164e63",
          "textColor": "#ffffff"
        },
        "lines": [
          "HD",
          "97",
          ".A33"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "HB102.B6",
        "initialSlot": 3,
        "targetSlot": 1,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #bef264 0%, #84cc16 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "HB",
          "102",
          ".B6"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "HD101.B52",
        "initialSlot": 4,
        "targetSlot": 5,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)",
          "border": "#1e40af",
          "spine": "#172554",
          "textColor": "#ffffff"
        },
        "lines": [
          "HD",
          "101",
          ".B52"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "HC100.B53A9",
        "initialSlot": 5,
        "targetSlot": 3,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #4ade80 0%, #22c55e 60%, #15803d 100%)",
          "border": "#166534",
          "spine": "#14532d",
          "textColor": "#ffffff"
        },
        "lines": [
          "HC",
          "100",
          ".B53",
          "A9"
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "Tahap 4",
    "code": "booksort04e",
    "hint": "Nombor lebih utama dari titik perpuluhan. Diakhiri dengan buku kuning",
    "explanation": "Nombor kelas tanpa titik perpuluhan mendahului nombor berperpuluhan. J133 dengan tarikh (1948 sebelum 1954), diikuti pembahagian perpuluhan J133.S3 (salinan 2) dan J133.S33 (tahun 1950).",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "J133.S3cop.2",
        "initialSlot": 1,
        "targetSlot": 4,
        "color": {
          "name": "merah",
          "bg": "linear-gradient(180deg, #f87171 0%, #dc2626 60%, #991b1b 100%)",
          "border": "#7f1d1d",
          "spine": "#450a0a",
          "textColor": "#ffffff"
        },
        "lines": [
          "J",
          "133",
          ".S3",
          "cop.2"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "J1331954.S42",
        "initialSlot": 2,
        "targetSlot": 2,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #bef264 0%, #84cc16 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "J",
          "133",
          "1954",
          ".S42"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "J1331948.J32",
        "initialSlot": 3,
        "targetSlot": 1,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fed7aa 0%, #fba94b 60%, #d97706 100%)",
          "border": "#b45309",
          "spine": "#78350f",
          "textColor": "#1f2937"
        },
        "lines": [
          "J",
          "133",
          "1948",
          ".J32"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "J1331954.S5",
        "initialSlot": 4,
        "targetSlot": 3,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #67e8f9 0%, #06b6d4 60%, #0e7490 100%)",
          "border": "#155e75",
          "spine": "#164e63",
          "textColor": "#ffffff"
        },
        "lines": [
          "J",
          "133",
          "1954",
          ".S5"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "J133.S331950",
        "initialSlot": 5,
        "targetSlot": 5,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%)",
          "border": "#a16207",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "J",
          "133",
          ".S33",
          "1950"
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "Tahap 5",
    "code": "booksort04f",
    "hint": "Buku kelabu ditengah-tengah.",
    "explanation": "Nombor kelas bulat RC793 disusun mengikut tahun (1965 sebelum 1967). Seterusnya nombor berperpuluhan: .19 (Buku kelabu di slot 3) mendahului .2 (.19 < .20). Bagi .2, Cutter .A6 sebelum .A7.",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "RC793.2.A7C41963",
        "initialSlot": 1,
        "targetSlot": 5,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "RC",
          "793",
          ".2",
          ".A7C4",
          "1963"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "RC7931965.K75",
        "initialSlot": 2,
        "targetSlot": 1,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)",
          "border": "#1e40af",
          "spine": "#172554",
          "textColor": "#ffffff"
        },
        "lines": [
          "RC",
          "793",
          "1965",
          ".K75"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "RC7931967.B73",
        "initialSlot": 3,
        "targetSlot": 2,
        "color": {
          "name": "merah",
          "bg": "linear-gradient(180deg, #f87171 0%, #dc2626 60%, #991b1b 100%)",
          "border": "#7f1d1d",
          "spine": "#450a0a",
          "textColor": "#ffffff"
        },
        "lines": [
          "RC",
          "793",
          "1967",
          ".B73"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "RC793.2.A6C4",
        "initialSlot": 4,
        "targetSlot": 4,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%)",
          "border": "#a16207",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "RC",
          "793.2",
          ".A6C4"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "RC793.19.A8N5",
        "initialSlot": 5,
        "targetSlot": 3,
        "color": {
          "name": "kelabu",
          "bg": "linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)",
          "border": "#374151",
          "spine": "#1f2937",
          "textColor": "#ffffff"
        },
        "lines": [
          "RC",
          "793",
          ".19",
          ".A8N5"
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "Tahap 6",
    "code": "booksort04g",
    "hint": "A6 sebelum A7.",
    "explanation": "Untuk ND6108, Cutter .M263 mendahului .M3 (.263 < .300). Seterusnya ND6108.M3 (karya asas), diikuti pecahan kedua .M3A6 sebelum .M3.A7. Akhir sekali nombor kelas seterusnya ND6109.",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "ND6108.M3",
        "initialSlot": 1,
        "targetSlot": 2,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "6108",
          ".M3"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "ND6108.M3.A7",
        "initialSlot": 2,
        "targetSlot": 4,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #bef264 0%, #84cc16 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "6108",
          ".M3",
          ".A7"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "ND6108.M3A6",
        "initialSlot": 3,
        "targetSlot": 3,
        "color": {
          "name": "kelabu",
          "bg": "linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)",
          "border": "#374151",
          "spine": "#1f2937",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "6108",
          ".M3A6"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "ND6108.M263",
        "initialSlot": 4,
        "targetSlot": 1,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)",
          "border": "#1e40af",
          "spine": "#172554",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "6108",
          ".M263"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "ND6109.M51999",
        "initialSlot": 5,
        "targetSlot": 5,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #93c5fd 0%, #60a5fa 60%, #2563eb 100%)",
          "border": "#1d4ed8",
          "spine": "#1e3a8a",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "6109",
          ".M5",
          "1999"
        ]
      }
    ]
  },
  {
    "id": 7,
    "title": "Tahap 7",
    "code": "booksort04h",
    "hint": "B2x lebih utama dari B23. Abaikan \"Urblib\"",
    "explanation": "QA71 mendahului QA76. Pada QA76, karya asas .H184 sebelum salinan cop.2. Untuk QA76.3, awalan lokasi 'UrbLib' diabaikan; Cutter .B2x mendahului .B23 (.2 < .23).",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "QA71.R65",
        "initialSlot": 1,
        "targetSlot": 1,
        "color": {
          "name": "teal",
          "bg": "linear-gradient(180deg, #67e8f9 0%, #06b6d4 60%, #0e7490 100%)",
          "border": "#155e75",
          "spine": "#164e63",
          "textColor": "#ffffff"
        },
        "lines": [
          "QA",
          "71",
          ".R65"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "QA76.3.B23",
        "initialSlot": 2,
        "targetSlot": 5,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)",
          "border": "#1e40af",
          "spine": "#172554",
          "textColor": "#ffffff"
        },
        "lines": [
          "QA",
          "76",
          ".3",
          ".B23"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "UrbLibQA76.3.B2x",
        "initialSlot": 3,
        "targetSlot": 4,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "UrbLib",
          "QA",
          "76",
          ".3",
          ".B2x"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "QA76.H184cop.2",
        "initialSlot": 4,
        "targetSlot": 3,
        "color": {
          "name": "coklat",
          "bg": "linear-gradient(180deg, #fdba74 0%, #ea580c 60%, #9a3412 100%)",
          "border": "#7c2d12",
          "spine": "#431407",
          "textColor": "#ffffff"
        },
        "lines": [
          "QA",
          "76",
          ".H184",
          "cop.2"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "QA76.H184",
        "initialSlot": 5,
        "targetSlot": 2,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #bef264 0%, #84cc16 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "QA",
          "76",
          ".H184"
        ]
      }
    ]
  },
  {
    "id": 8,
    "title": "Tahap 8",
    "code": "booksort04i",
    "hint": "Dimulakan dengan buku hijau. Diakhiri dengan buku kuning",
    "explanation": "PS118.6 mendahului PS119. Bagi PS118.6, Cutter .B1 sebelum .B19 (.1 < .19). Seterusnya dalam PS119: .45 sebelum .5 (.45 < .50), dan .5 sebelum .51 (.50 < .51).",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "PS119.45.N93vol.3",
        "initialSlot": 1,
        "targetSlot": 3,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fed7aa 0%, #fba94b 60%, #d97706 100%)",
          "border": "#b45309",
          "spine": "#78350f",
          "textColor": "#1f2937"
        },
        "lines": [
          "PS",
          "119",
          ".45",
          ".N93",
          "vol.3"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "PS118.6.B19",
        "initialSlot": 2,
        "targetSlot": 2,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%)",
          "border": "#a16207",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "PS",
          "118",
          ".6",
          ".B19"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "PS119.51",
        "initialSlot": 3,
        "targetSlot": 5,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fef08a 0%, #facc15 60%, #a16207 100%)",
          "border": "#854d0e",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "PS",
          "119",
          ".51"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "PS119.5",
        "initialSlot": 4,
        "targetSlot": 4,
        "color": {
          "name": "coklat",
          "bg": "linear-gradient(180deg, #fdba74 0%, #ea580c 60%, #9a3412 100%)",
          "border": "#7c2d12",
          "spine": "#431407",
          "textColor": "#ffffff"
        },
        "lines": [
          "PS",
          "119",
          ".5"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "PS118.6.B11966cop.2",
        "initialSlot": 5,
        "targetSlot": 1,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #bef264 0%, #84cc16 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "PS",
          "118.6",
          ".B1",
          "1966",
          "cop.2"
        ]
      }
    ]
  },
  {
    "id": 9,
    "title": "Tahap 9",
    "code": "booksort04j",
    "hint": "Anda mampu selesaikan sendiri..",
    "explanation": "Subkelas ND mendahului NK. Bagi ND: ND893 sebelum ND894. Bagi NK894, Cutter .A13 mendahului .C35 (.13 < .35). Untuk .C35, edisi tahun 1988 sebelum salinan tambahan 'x'.",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "NK894.C35x",
        "initialSlot": 1,
        "targetSlot": 5,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "NK",
          "894",
          ".C35x"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "NK894.C351988",
        "initialSlot": 2,
        "targetSlot": 4,
        "color": {
          "name": "kelabu",
          "bg": "linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)",
          "border": "#374151",
          "spine": "#1f2937",
          "textColor": "#ffffff"
        },
        "lines": [
          "NK",
          "894",
          ".C35",
          "1988"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "ND894.B45",
        "initialSlot": 3,
        "targetSlot": 2,
        "color": {
          "name": "merah",
          "bg": "linear-gradient(180deg, #f87171 0%, #dc2626 60%, #991b1b 100%)",
          "border": "#7f1d1d",
          "spine": "#450a0a",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "894",
          ".B45"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "ND893.D3171989",
        "initialSlot": 4,
        "targetSlot": 1,
        "color": {
          "name": "biru",
          "bg": "linear-gradient(180deg, #67e8f9 0%, #06b6d4 60%, #0e7490 100%)",
          "border": "#155e75",
          "spine": "#164e63",
          "textColor": "#ffffff"
        },
        "lines": [
          "ND",
          "893",
          ".D317",
          "1989"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "NK894.A13",
        "initialSlot": 5,
        "targetSlot": 3,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fed7aa 0%, #fba94b 60%, #d97706 100%)",
          "border": "#b45309",
          "spine": "#78350f",
          "textColor": "#1f2937"
        },
        "lines": [
          "NK",
          "894",
          ".A13"
        ]
      }
    ]
  },
  {
    "id": 10,
    "title": "Tahap 10",
    "code": "booksort04k",
    "hint": "Kacang..",
    "explanation": "Semua buku dalam kelas BS497. Susunan dinilai mengikut nilai perpuluhan nombor pengarang (Cutter): .A2 (.200) < .A3 (.300) < .A315 (.315) < .A32 (.320) < .B54.",
    "books": [
      {
        "id": "b1",
        "bookNumber": 1,
        "callNumber": "BS497.A32",
        "initialSlot": 1,
        "targetSlot": 4,
        "color": {
          "name": "coklat",
          "bg": "linear-gradient(180deg, #fdba74 0%, #ea580c 60%, #9a3412 100%)",
          "border": "#7c2d12",
          "spine": "#431407",
          "textColor": "#ffffff"
        },
        "lines": [
          "BS",
          "497",
          ".A32"
        ]
      },
      {
        "id": "b2",
        "bookNumber": 2,
        "callNumber": "BS497.A2",
        "initialSlot": 2,
        "targetSlot": 1,
        "color": {
          "name": "kuning",
          "bg": "linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%)",
          "border": "#a16207",
          "spine": "#713f12",
          "textColor": "#1f2937"
        },
        "lines": [
          "BS",
          "497",
          ".A2"
        ]
      },
      {
        "id": "b3",
        "bookNumber": 3,
        "callNumber": "BS497.A315",
        "initialSlot": 3,
        "targetSlot": 3,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #84cc16 0%, #65a30d 60%, #4d7c0f 100%)",
          "border": "#3f6212",
          "spine": "#1a2e05",
          "textColor": "#ffffff"
        },
        "lines": [
          "BS",
          "497",
          ".A315"
        ]
      },
      {
        "id": "b4",
        "bookNumber": 4,
        "callNumber": "BS497.B54",
        "initialSlot": 4,
        "targetSlot": 5,
        "color": {
          "name": "hijau",
          "bg": "linear-gradient(180deg, #4ade80 0%, #22c55e 60%, #15803d 100%)",
          "border": "#166534",
          "spine": "#14532d",
          "textColor": "#ffffff"
        },
        "lines": [
          "BS",
          "497",
          ".B54"
        ]
      },
      {
        "id": "b5",
        "bookNumber": 5,
        "callNumber": "BS497.A3",
        "initialSlot": 5,
        "targetSlot": 2,
        "color": {
          "name": "merah",
          "bg": "linear-gradient(180deg, #f87171 0%, #dc2626 60%, #991b1b 100%)",
          "border": "#7f1d1d",
          "spine": "#450a0a",
          "textColor": "#ffffff"
        },
        "lines": [
          "BS",
          "497",
          ".A3"
        ]
      }
    ]
  }
];
