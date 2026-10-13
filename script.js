// ==========================================
// 0. AUDIO ENGINE & BGM MP3 INTEGRATION
// ==========================================
const bgmAudio = new Audio('bgm.mp3'); 
bgmAudio.loop = true;
bgmAudio.volume = 0.5; 

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq1, freq2, type, duration) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
        if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + duration);
        
        gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function playSFX(type) {
    initAudio();
    if (type === 'click') playTone(800, 800, 'sine', 0.05);
    else if (type === 'correct') playTone(600, 1200, 'sine', 0.25);
    else if (type === 'wrong') playTone(220, 110, 'sawtooth', 0.35);
    else if (type === 'countdown') playTone(440, 440, 'sine', 0.12);
    else if (type === 'levelUp') {
        playTone(440, 554.37, 'square', 0.15);
        setTimeout(() => playTone(659.25, 880, 'square', 0.35), 150);
    }
    else if (type === 'gameOver') playTone(300, 40, 'sawtooth', 0.6);
}

function stopBGM() {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
}

function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==========================================
// 1. DATABASE PRODUK
// ==========================================
const skincareDatabase = {
    "Facewash": [
        { img: "facewash1.jpg", nama: "Facewash Hanasui Pink", harga: "25rb", ukuran: "60ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid + MULTIVITAMIN", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash2.jpg", nama: "Facewash Hanasui Hijau", harga: "25rb", ukuran: "60ml", cocok: ["kombinasi", "beruntusan", "berjerawat"], ingredients: "Nano Salicylic Acid, Centella Asiatica, Panthenol + MULTIVITAMIN", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash3.jpg", nama: "Facewash Hadalabo Putih Gokujyun", harga: "42rb", ukuran: "100ml", cocok: ["kering"], ingredients: "2 Tipe Hyaluronic Acid", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash4.jpg", nama: "Facewash Hadalabo Biru Shirojyun", harga: "42rb", ukuran: "100ml", cocok: ["kering", "bekas jerawat", "kusam"], ingredients: "2 Tipe Hyaluronic Acid, Alpha Arbutin dan Vitamin C", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash5.jpg", nama: "Facewash Y.O.U Hijau", harga: "36rb", ukuran: "100ml", cocok: ["berminyak", "berjerawat", "beruntusan", "pori pori"], ingredients: "1,5% Salicylic Acid dan Amino Acid", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash6.jpg", nama: "Facewash Glamazing Hijau", harga: "36rb", ukuran: "100ml", cocok: ["berminyak", "berjerawat", "beruntusan", "sensitif", "pori pori"], ingredients: "1% Salicylic Acid dan Panthenol", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash7.jpg", nama: "Facewash Glad2Glow Hijau", harga: "36rb", ukuran: "70ml", cocok: ["berminyak", "beruntusan", "berjerawat"], ingredients: "Salicylic Acid dan Centella", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash10.jpeg", nama: "Emina Bright Stuff Facial Wash", harga: "35rb", ukuran: "100ml", cocok: ["kombinasi", "kusam", "berjerawat", "bekas jerawat"], ingredients: "Niacinamide, Allantoin", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash11.jpeg", nama: "The Originote Low pH Cicamide Facial Cleanser", harga: "42rb", ukuran: "150ml", cocok: ["berminyak", "berjerawat", "beruntusan", "skin barrier rusak", "barrier"], ingredients: "Centella Asiatica, Ceramide", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash12.jpeg", nama: "Acne Gentle Cleansing Foam Azarine", harga: "35rb", ukuran: "60ml", cocok: ["berminyak", "berjerawat", "beruntusan"], ingredients: "Tea Tree dan Salicylic Acid", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash13.jpeg", nama: "Facewash Glad2Glow Ungu", harga: "38rb", ukuran: "70ml", cocok: ["kering", "skin barrier rusak", "barrier"], ingredients: "Blueberry Extract dan Ceramide", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash14.jpeg", nama: "Wardah Facewash Light+", harga: "38rb", ukuran: "100ml", cocok: ["kering", "kusam"], ingredients: "Nano Niacinamide dan Low Molecular Hyaluronic", tekstur: "Gel", waktu: "Pagi dan Malam" }
    ],

    "Toner": [
        { img: "toner1.jpg", nama: "Toner Hanasui Pink", harga: "30rb", ukuran: "105ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner2.jpg", nama: "Toner Autumn Ungu", harga: "50rb", ukuran: "500ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "5% Niacinamide, Vitamin C, Alpha Arbutin", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner3.jpg", nama: "Toner Autumn Hijau", harga: "60rb", ukuran: "500ml", cocok: ["kombinasi", "berjerawat", "beruntusan"], ingredients: "Salicylic Acid dan Centella Asiatica", tekstur: "Watery", waktu: "Malam" },
        { img: "toner4.jpeg", nama: "Emina Bright Stuff Toner", harga: "31rb", ukuran: "100ml", cocok: ["kering", "kusam"], ingredients: "Oxybione, 2% Niacinamide", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner5.jpeg", nama: "Glad2Glow Brightening Toner", harga: "45rb", ukuran: "80ml", cocok: ["kering", "kusam"], ingredients: "Pomegranate Extract, Niacinamide", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner6.jpeg", nama: "Wardah Lightening Face Toner", harga: "30rb", ukuran: "125ml", cocok: ["kering", "kusam"], ingredients: "Niacinamide", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner7.jpeg", nama: "The Originote Cica-B5 Soothing Essence Toner", harga: "38rb", ukuran: "80ml", cocok: ["berminyak", "sensitif"], ingredients: "Centella Asiatica, Panthenol", tekstur: "Watery", waktu: "Malam" },
        { img: "toner8.jpeg", nama: "Azarine MoistureRich Hydrating Toner", harga: "48rb", ukuran: "90ml", cocok: ["kering"], ingredients: "Hyaluronic Acid", tekstur: "Watery", waktu: "Pagi dan Malam" }
    ],

    "Serum": [
        { img: "serum1.jpg", nama: "Serum Hanasui Brightening", harga: "30rb", ukuran: "20ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "10% Advanced Niacinamide", tekstur: "Agak Kental", waktu: "Pagi dan Malam" },
        { img: "serum2.jpg", nama: "Serum Hanasui Acne", harga: "25rb", ukuran: "20ml", cocok: ["berminyak", "kusam", "berjerawat", "beruntusan", "pori pori"], ingredients: "0,5% Salicylic Acid, Centella Asiatica", tekstur: "Agak Kental", waktu: "Malam" },
        { img: "serum3.jpg", nama: "Serum Hanasui Bakuchiol", harga: "30rb", ukuran: "20ml", cocok: ["kering"], ingredients: "Bakuchiol", tekstur: "Kental", waktu: "Pagi dan Malam" },
        { img: "serum4.jpg", nama: "Serum Hanasui MiniPore", harga: "30rb", ukuran: "20ml", cocok: ["berminyak", "pori pori"], ingredients: "NanoActive Salicylic Acid", tekstur: "Agak Kental", waktu: "Malam" },
        { img: "serum5.jpg", nama: "Serum Somethinc Pink", harga: "120rb", ukuran: "20ml", cocok: ["berminyak", "beruntusan", "berjerawat", "pori pori"], ingredients: "2% Salicylic Acid", tekstur: "Watery", waktu: "Malam" },
        { img: "serum6.jpg", nama: "Serum Somethinc Propolis", harga: "120rb", ukuran: "20ml", cocok: ["kering", "skin barrier rusak", "barrier"], ingredients: "60% Korean Propolis, Manuka Honey", tekstur: "Kental", waktu: "Pagi dan Malam" },
        { img: "serum7.jpg", nama: "Serum Skin1004 Brightening", harga: "250rb", ukuran: "100ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Niacinamide dan Centella Asiatica", tekstur: "Agak Kental", waktu: "Pagi dan Malam" },
        { img: "serum8.jpeg", nama: "The Originote Hyalu-C Serum", harga: "42rb", ukuran: "20ml", cocok: ["kombinasi", "kusam", "bekas jerawat", "beruntusan", "skin barrier rusak", "barrier"], ingredients: "Vitamin C, Hyaluronic Acid, Niacinamide, Ceramide", tekstur: "Cair", waktu: "Pagi dan Malam" },
        { img: "serum9.jpeg", nama: "The Originote Niacinamide 10% Serum", harga: "48rb", ukuran: "20ml", cocok: ["kombinasi", "kusam"], ingredients: "Niacinamide 10%, Alpha Arbutin, Glutathione", tekstur: "Cair", waktu: "Pagi dan Malam" },
        { img: "serum10.jpeg", nama: "Emina Bright Stuff Face Serum", harga: "48rb", ukuran: "30ml", cocok: ["kusam", "kering"], ingredients: "Niacinamide", tekstur: "Cair", waktu: "Pagi dan Malam" },
        { img: "serum11.jpeg", nama: "Implora Acne Serum", harga: "37rb", ukuran: "20ml", cocok: ["kombinasi", "berjerawat", "beruntusan", "bekas jerawat"], ingredients: "2% Salicylic Acid, Centella Asiatica", tekstur: "Cair", waktu: "Malam" },
        { img: "serum12.jpeg", nama: "Implora 24k Gold Serum", harga: "35rb", ukuran: "20ml", cocok: ["kering", "bekas jerawat", "kusam"], ingredients: "Niacinamide 5%, Vitamin C, Collagen", tekstur: "Kental", waktu: "Pagi dan Malam" },
        { img: "serum13.jpeg", nama: "Glad2Glow Serum Pomegranate", harga: "49rb", ukuran: "17ml", cocok: ["kombinasi", "kusam", "beruntusan", "bekas jerawat"], ingredients: "10% Niacinamide, Pomegranate Extract", tekstur: "Agak Kental", waktu: "Pagi dan Malam" },
        { img: "serum14.jpeg", nama: "Glad2Glow Serum Centella", harga: "47rb", ukuran: "17ml", cocok: ["kombinasi", "berjerawat", "beruntusan", "bekas jerawat", "pori pori"], ingredients: "2% Salicylic Acid, Centella Asiatica", tekstur: "Agak Kental", waktu: "Malam" },
        { img: "serum15.jpeg", nama: "Glad2Glow Perfect Vitamin C", harga: "42rb", ukuran: "17ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "5 Types Hyaluronic, Ceramide, Panthenol", tekstur: "Agak Kental", waktu: "Pagi dan Malam" }
    ],

    "Moisturizer": [
        { img: "moist1.jpg", nama: "Moisturizer Hanasui 10× Ceramide Probiotics", harga: "38rb", ukuran: "30ml", cocok: ["kering", "skin barrier rusak", "barrier", "sensitif"], ingredients: "5× Ceramide, Niacinamide, Hyaluronic Acid", tekstur: "Agak Kental", waktu: "Pagi dan Malam" },
        { img: "moist2.jpg", nama: "Moisturizer Hanasui 10× Brightening", harga: "38rb", ukuran: "30ml", cocok: ["kering", "skin barrier rusak", "barrier", "bekas jerawat", "kusam"], ingredients: "5× Ceramide, 5% Niacinamide, Tranexamic Acid", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist3.jpeg", nama: "Emina Bright Glow Moisturizer", harga: "42rb", ukuran: "30ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Niacinamide, Vitamin C, Licorice Extract", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist4.jpeg", nama: "Emina Barrier Water Moisturizer", harga: "42rb", ukuran: "30ml", cocok: ["kering", "skin barrier rusak", "barrier"], ingredients: "Ceramide, Niacinamide, Sodium Hyaluronate", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist5.jpeg", nama: "Emina Water Calming Moisturizer", harga: "42rb", ukuran: "30ml", cocok: ["berminyak", "berjerawat", "beruntusan", "bekas jerawat", "sensitif"], ingredients: "2% Centella Asiatica, Niacinamide, Panthenol", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist6.jpeg", nama: "The Originote Hyalucera Moisturizer", harga: "48rb", ukuran: "50ml", cocok: ["kering", "skin barrier rusak", "barrier"], ingredients: "Hyaluronic Acid, Ceramide", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist7.jpeg", nama: "The Originote Brightening Moisturizer", harga: "49rb", ukuran: "50ml", cocok: ["kering", "kusam", "bekas jerawat", "skin barrier rusak", "barrier"], ingredients: "Niacinamide, Tranexamic Acid, Alpha Arbutin", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist8.jpeg", nama: "Hanasui Acne Care Moisturizer", harga: "49rb", ukuran: "30ml", cocok: ["berminyak", "berjerawat", "bekas jerawat", "sensitif"], ingredients: "Centella Asiatica, Niacinamide, Panthenol", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "moist9.jpeg", nama: "Facetology Triple Care Acne Calm Moisturizer", harga: "115rb", ukuran: "35ml", cocok: ["kering", "skin barrier rusak", "barrier", "sensitif"], ingredients: "8 Types Ceramide, Centella, Panthenol", tekstur: "Cream", waktu: "Pagi dan Malam" }
    ],

    "Sunscreen": [
        { img: "sunscreen1.jpg", nama: "Sunscreen Hanasui SPF 30 PA+++", harga: "28rb", ukuran: "30ml", cocok: ["kombinasi"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen2.jpg", nama: "Sunscreen Hanasui SPF 50 PA++++", harga: "38rb", ukuran: "30ml", cocok: ["kombinasi"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen3.jpg", nama: "Sunscreen Glamazing SPF 50 PA+++", harga: "60rb", ukuran: "50ml", cocok: ["kering"], ingredients: "Physical UV Filters", tipe: "Physical", finish: "Matte", tekstur: "Cream", waktu: "Pagi" },
        { img: "sunscreen4.jpg", nama: "Sunscreen Madam Gie SPF 35 PA+++", harga: "38rb", ukuran: "50ml", cocok: ["kombinasi"], ingredients: "Hybrid UV Filters", tipe: "Hybrid", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen5.jpg", nama: "Sunscreen Acnaway SPF 35 PA+++", harga: "40rb", ukuran: "30ml", cocok: ["berminyak"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Matte", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen6.jpg", nama: "Sunscreen El Formula SPF 50 PA+++", harga: "70rb", ukuran: "50ml", cocok: ["kombinasi"], ingredients: "Hybrid UV Filters", tipe: "Hybrid", finish: "Matte", tekstur: "Watery", waktu: "Pagi" },
        { img: "sunscreen7.jpeg", nama: "Azarine Cicamide Barrier Sunscreen SPF 35 PA+++", harga: "39rb", ukuran: "40ml", cocok: ["kombinasi", "skin barrier rusak", "barrier"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen8.jpeg", nama: "Azarine Calm My Acne Sunscreen SPF 35 PA+++", harga: "55rb", ukuran: "40ml", cocok: ["kombinasi", "berjerawat", "sensitif"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen9.jpeg", nama: "Emina Water UV Gel SPF 50 PA++++", harga: "50rb", ukuran: "25ml", cocok: ["kering", "kusam", "bekas jerawat"], ingredients: "Hybrid UV Filters", tipe: "Hybrid", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen10.jpg", nama: "Emina Airy UV Gel SPF 50 PA++++", harga: "50rb", ukuran: "25ml", cocok: ["berminyak", "berjerawat", "beruntusan", "sensitif"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen11.jpeg", nama: "Wardah Acne Calming Sunscreen SPF 35 PA+++", harga: "43rb", ukuran: "35ml", cocok: ["berminyak", "berjerawat", "beruntusan", "sensitif"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen12.jpeg", nama: "Wardah Vitamin C Sunscreen Serum SPF 35 PA+++", harga: "42rb", ukuran: "40ml", cocok: ["kering", "kusam", "bekas jerawat"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen13.jpeg", nama: "The Originote Ceramella Sunscreen SPF 50 PA+++", harga: "45rb", ukuran: "50ml", cocok: ["kombinasi", "kusam", "bekas jerawat", "barrier", "beruntusan", "sensitif"], ingredients: "Chemical UV Filters", tipe: "Chemical", finish: "Glowing", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen14.jpeg", nama: "Facetology Pure Physical Sunscreen SPF 40 PA+++", harga: "75rb", ukuran: "30ml", cocok: ["kering"], ingredients: "Physical UV Filters", tipe: "Physical", finish: "Matte", tekstur: "Cream", waktu: "Pagi" }
    ]
};

// ==========================================
// 2. KAMUS INGREDIENTS
// ==========================================
const kamusData = {
    "Jerawat & Beruntusan": [
        { nama: "Salicylic Acid (BHA)", fungsi: "Membersihkan pori tersumbat, eksfoliasi minyak, meredakan radang.", takaran: "0.5% - 2%", cocokDi: "Serum / Exfoliating Toner / Facewash" },
        { nama: "Centella Asiatica", fungsi: "Menenangkan kemerahan, iritasi, dan mempercepat pemulihan jerawat.", takaran: "Pure Extract", cocokDi: "Serum / Moisturizer" },
        { nama: "Sulfur (Belerang)", fungsi: "Mengeringkan jerawat aktif dengan cepat dan menyerap kelebihan sebum.", takaran: "1% - 5%", cocokDi: "Spot Treatment" },
        { nama: "Tea Tree Oil", fungsi: "Antimikroba alami untuk melawan bakteri penyebab jerawat.", takaran: "0.5% - 1%", cocokDi: "Spot Treatment" }
    ],
    "Kulit Berminyak & Pori": [
        { nama: "Salicylic Acid (BHA)", fungsi: "Membersihkan pori tersumbat, eksfoliasi minyak, meredakan radang.", takaran: "0.5% - 2%", cocokDi: "Serum / Toner / Facewash" },
        { nama: "Niacinamide", fungsi: "Mengatur produksi minyak dan menyamarkan tampilan pori besar.", takaran: "2% - 10%", cocokDi: "Serum" },
        { nama: "Zinc PCA", fungsi: "Menyeimbangkan sebum dan mengurangi kilap berlebih di wajah.", takaran: "0.5% - 1%", cocokDi: "Serum / Toner" }
    ],
    "Kusam & Bekas Jerawat": [
        { nama: "Niacinamide", fungsi: "Mencerahkan kulit kusam, menyamarkan noda hitam, meratakan warna kulit.", takaran: "2% - 10%", cocokDi: "Serum" },
        { nama: "Alpha Arbutin", fungsi: "Menghambat enzim tyrosinase memudarkan bekas jerawat kehitaman.", takaran: "1% - 2%", cocokDi: "Serum" },
        { nama: "Vitamin C", fungsi: "Antioksidan tinggi mencerahkan dan memberi efek glowing seketika.", takaran: "5% - 15%", cocokDi: "Serum" },
        { nama: "Tranexamic Acid", fungsi: "Menghambat pembentukan pigmen gelap akibat bekas jerawat membandel.", takaran: "2% - 5%", cocokDi: "Serum" }
    ],
    "Skin Barrier & Sensitif": [
        { nama: "Ceramide", fungsi: "Memperbaiki dan memperkuat lapisan pelindung kulit (skin barrier).", takaran: "Kompleks 3x-5x", cocokDi: "Moisturizer / Facewash" },
        { nama: "Panthenol (Pro-Vitamin B5)", fungsi: "Menghidrasi mendalam dan menenangkan kulit reaktif/iritasi.", takaran: "1% - 5%", cocokDi: "Moisturizer / Toner" },
        { nama: "Allantoin", fungsi: "Mendinginkan kulit meradang, kemerahan, atau kasar.", takaran: "0.1% - 0.5%", cocokDi: "Gel / Moisturizer" }
    ]
};

// ==========================================
// 3. DATABASE TIPS & TRICK
// ==========================================
const tipsData = {
    "Kulit Berminyak": [
        { judul: "Skip Moisturizer Pagi Jika Terlalu Greasy", detail: "Jika kulitmu sangat berminyak di pagi hari, kamu boleh langsung menggunakan Sunscreen bertipe Gel/Water-based yang sudah mengandung pelembap agar wajah tidak semakin berkilap." },
        { judul: "Gunakan Teknik Double Cleansing Malam Hari", detail: "Gunakan Micellar Water bebas minyak sebelum cuci muka di malam hari untuk mengangkat sisa minyak dan debu yang menempel seharian." },
        { judul: "Pilih Sunscreen Bertipe Matte / Chemical", detail: "Hindari Physical Sunscreen yang thick. Gunakan Chemical/Hybrid Sunscreen dengan hasil akhir Matte atau Dry-Touch." },
        { judul: "Jangan Scrub Wajah Terlalu Sering", detail: "Menggosok wajah berlebihan justru memicu kulit memproduksi minyak secara otomatis (rebound oil)." }
    ],
    "Kulit Kering": [
        { judul: "Aplikasikan Skincare saat Kulit Masih Lembap", detail: "Gunakan Hydrating Toner atau Moisturizer saat kulit setengah basah setelah cuci muka agar kandungan penarik air bekerja lebih efektif." },
        { judul: "Hindari Sabun Cuci Muka Berbusa Banyak", detail: "Pilih Gentle Cleanser bertekstur Gel/Cream tanpa kandungan SLS/SLES agar tidak mengikis kelembapan alami kulit." },
        { judul: "Gunakan Moisturizer Bertekstur Rich/Cream", detail: "Pilih pelembap mengandung Ceramide atau Squalane untuk mengunci kadar air di dalam sel kulit sepanjang hari." }
    ],
    "Berjerawat": [
        { judul: "Gunakan Acne Patch untuk Jerawat Bernanah", detail: "Jangan memencet jerawat dengan tangan. Tempelkan Acne Patch di malam hari agar nanah terserap higienis tanpa menimbulkan bekas luka." },
        { judul: "Rutin Ganti Sarung Bantal 1 Minggu Sekali", detail: "Kain sarung bantal menyimpan banyak bakteri dan minyak yang sering menjadi pemicu timbulnya jerawat baru di pipi." },
        { judul: "Gunakan Spot Treatment di Urutan Terakhir", detail: "Gunakan Spot Treatment (Salicylic Acid/Sulfur) hanya di titik jerawat aktif setelah pelembap meresap sempurna." }
    ],
    "Beruntusan": [
        { judul: "Rutin Eksfoliasi BHA 1-2 Kali Seminggu", detail: "Beruntusan biasanya disebabkan oleh pori-pori tersumbat minyak dan sel kulit mati. Pakai serum Salicylic Acid secara berkala di malam hari." },
        { judul: "Perhatikan Produk Perawatan Rambut", detail: "Sisa produk sampo atau minyak rambut yang menempel di dahi sering kali menjadi pemicu utama timbulnya beruntusan di jidat." }
    ],
    "Kulit Kusam": [
        { judul: "Kombinasikan Vitamin C + Sunscreen di Pagi Hari", detail: "Memakai Serum Vitamin C sebelum Sunscreen akan melipatgandakan perlindungan antioksidan dari paparan sinar UV matahari." },
        { judul: "Eksfoliasi Sel Kulit Mati Secara Teratur", detail: "Penumpukan sel kulit mati membuat wajah terlihat gelap dan kusam. Lakukan eksfoliasi lembut menggunakan AHA/Lactic Acid di malam hari." }
    ],
    "Kemerahan": [
        { judul: "Kompres Wajah Menggunakan Hydrating Toner", detail: "Gunakan teknik Chizu Saeki Method (CSM) dengan membasahi kapas menggunakan toner Centella/Panthenol lalu tempelkan di area kulit kemerahan selama 5 menit." },
        { judul: "Hindari Air Panas Saat Mencuci Muka", detail: "Air panas memicu pelebaran pembuluh darah di wajah yang membuat kulit tampak makin merah dan teriritasi." }
    ],
    "Skin Barrier Rusak": [
        { judul: "Stop Semua Bahan Aktif Eksfoliasi & Retinol", detail: "Saat kulit perih atau rasa terbakar, hentikan pemakaian AHA, BHA, Vitamin C, dan Retinol sampai kondisi kulit pulih sepenuhnya." },
        { judul: "Fokus Pada Basic Skincare (Cleanser + Moisturizer + Sunscreen)", detail: "Gunakan pelembap khusus mengandung Ceramide, Hyaluronic Acid, atau Centella Asiatica untuk menyusun kembali benteng perlindungan kulit." }
    ],
    "Pori-Pori Besar": [
        { judul: "Gunakan Niacinamide 2-5% Secara Konsisten", detail: "Niacinamide terbukti membantu meregangkan elastisitas pori-pori dan menyeimbangkan produksi minyak sehingga pori-pori tampak lebih ringkas." },
        { judul: "Jangan Biarkan Wajah Kotor Saat Tidur", detail: "Pori-pori terlihat besar akibat tersumbat oleh sisa kotoran yang memadat menjadi komedo. Selalu bersihkan wajah sebelum tidur." }
    ]
};

let selectedName = '';
let selectedSkinType = '';
let selectedSkinProblems = [];

// ==========================================
// 4. NAVIGASI LAYAR
// ==========================================
function switchScreen(screenId) {
    playSFX('click');
    stopBGM();
    if (typeof triviaState !== 'undefined' && triviaState.timer) clearInterval(triviaState.timer);
    
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    
    if (screenId === 'home-screen') renderHomeBadges();
    if (screenId === 'analisa-screen') initAnalisa();
    if (screenId === 'kamus-screen') initKamus();
    if (screenId === 'tips-screen') initTips();
    if (screenId === 'trivia-screen') initTrivia();
}

function renderHomeBadges() {
    const unlockedLevel = parseInt(localStorage.getItem('skincare_unlocked_level') || 0);
    const badgeContainer = document.getElementById('home-badge-container');
    if (!badgeContainer) return;

    let badgesHTML = '<h3 style="font-size: 13px; color: #D81B60; margin-bottom: 8px;">Koleksi Badge Kamu:</h3><div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">';
    let hasBadge = false;

    if (unlockedLevel >= 1) { badgesHTML += `<span style="background: #E0F7FA; color: #00796B; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">Rookie</span>`; hasBadge = true; }
    if (unlockedLevel >= 2) { badgesHTML += `<span style="background: #FFF9C4; color: #F57F17; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">Middle</span>`; hasBadge = true; }
    if (unlockedLevel >= 3) { badgesHTML += `<span style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">Expert</span>`; hasBadge = true; }

    if (!hasBadge) badgesHTML += `<span style="color: #888; font-size: 11px; font-style: italic;">Selesaikan Trivia Skincare untuk klaim Badge!</span>`;
    badgeContainer.innerHTML = badgesHTML + '</div>';
}

function checkUpdatePopup() {
    const modal = document.createElement('div');
    modal.id = 'update-modal';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:9999;";
    modal.innerHTML = `
        <div style="background:white; padding:20px; border-radius:15px; width:85%; max-width:320px; text-align:center;">
            <h3 style="color:#D81B60; margin-bottom:10px;">Update Terbaru Web</h3>
            <p style="font-size:12px; color:#555; text-align:left; line-height:1.5; margin-bottom:15px;">
                - Tampilan web baru & interaktif.<br>
                - Fitur baru: Tips & Trick Skincare lengkap!<br>
                - Trivia game 3 level dengan audio & timer!
            </p>
            <div style="display:flex; justify-content:center;">
                <button class="menu-btn" style="padding: 10px 30px;" onclick="document.getElementById('update-modal').remove();">Lanjut</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ==========================================
// 5. LOGIKA ANALISA KULIT
// ==========================================
function initAnalisa() { resetAnalisa(); }

function nextAnalisaStep(step) {
    playSFX('click');
    if (step === 2) {
        const nameInput = document.getElementById('user-name');
        if (!nameInput || !nameInput.value.trim()) { alert('Harap masukkan nama kamu terlebih dahulu!'); return; }
        selectedName = nameInput.value.trim();
    }
    document.querySelectorAll('.analisa-step').forEach(el => el.style.display = 'none');
    const targetStep = document.getElementById(`analisa-step-${step}`);
    if (targetStep) targetStep.style.display = 'block';
}

function toggleSingleSkinType(btn, type) {
    playSFX('click');
    document.querySelectorAll('#skin-type-options .option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSkinType = type;
    document.getElementById('btn-next-step3').style.display = 'block';
}

function toggleMultiProblem(btn, problem) {
    playSFX('click');
    if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedSkinProblems = selectedSkinProblems.filter(p => p !== problem);
    } else {
        btn.classList.add('selected');
        selectedSkinProblems.push(problem);
    }
    document.getElementById('btn-show-result').style.display = selectedSkinProblems.length > 0 ? 'block' : 'none';
}

function getBestProductForProblems(category, skinType, problems) {
    const list = skincareDatabase[category];
    if (!list || list.length === 0) return null;

    let bestProd = list[0];
    let maxScore = -1;

    list.forEach(prod => {
        let score = 0;
        const tags = prod.cocok.map(t => t.toLowerCase());

        if (tags.includes(skinType.toLowerCase())) score += 3;
        problems.forEach(prob => {
            if (tags.includes(prob.toLowerCase())) score += 5;
            if (prob === 'berjerawat' && (tags.includes('jerawat aktif') || tags.includes('beruntusan'))) score += 4;
            if (prob === 'skin barrier rusak' && tags.includes('barrier')) score += 4;
        });

        if (score > maxScore) {
            maxScore = score;
            bestProd = prod;
        }
    });

    return bestProd;
}

function generateRecommendation() {
    playSFX('correct');

    const problemLabels = selectedSkinProblems.map(p => {
        if (p === 'berjerawat') return 'JERAWAT & BERUNTUSAN';
        if (p === 'kusam') return 'KUSAM & BEKAS JERAWAT';
        if (p === 'skin barrier rusak') return 'KEMERAHAN & SKIN BARRIER RUSAK';
        if (p === 'pori pori') return 'PORI-PORI BESAR / MINYAK BERLEBIH';
        return p.toUpperCase();
    });

    document.getElementById('result-name').innerText = `Hasil Analisa Kulit ${selectedName} 👋`;
    document.getElementById('result-summary').innerHTML = `
        <strong>Nama:</strong> ${selectedName}<br>
        <strong>Tipe Kulit:</strong> ${selectedSkinType.toUpperCase()}<br>
        <strong>Keluhan Utama:</strong> ${problemLabels.join(', ')}
    `;

    const listContainer = document.getElementById('recommendation-list');
    listContainer.innerHTML = '';

    const categories = ["Facewash", "Toner", "Serum", "Moisturizer", "Sunscreen"];
    let recommendations = [];

    categories.forEach(cat => {
        const best = getBestProductForProblems(cat, selectedSkinType, selectedSkinProblems);
        if (best) recommendations.push({ category: cat, ...best });
    });

    // Render tampilan di layar HP pengguna
    recommendations.forEach(prod => {
        const item = document.createElement('div');
        item.style.cssText = `background: #FFF0F3; border: 1px solid #F8BBD0; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 12px; margin-bottom: 12px; text-align: left;`;

        let extraInfo = '';
        if (prod.tipe) extraInfo += ` | Tipe: ${prod.tipe}`;
        if (prod.finish) extraInfo += ` | Finish: ${prod.finish}`;

        item.innerHTML = `
            <img src="${prod.img}" alt="${prod.nama}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #F8BBD0;" onerror="this.src='https://via.placeholder.com/60x80?text=No+Img'">
            <div style="flex: 1;">
                <span style="font-size: 10px; background: #D81B60; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${prod.category}</span>
                <h4 style="margin: 4px 0 2px 0; color: #D81B60; font-size: 13px;">${prod.nama}</h4>
                <p style="margin: 0; font-size: 11px; color: #444;"><strong>Harga:</strong> ${prod.harga} (${prod.ukuran}) | <strong>Tekstur:</strong> ${prod.tekstur}${extraInfo}</p>
                <p style="margin: 3px 0 0 0; font-size: 11px; color: #AD1457;"><strong>Ingredients Utama:</strong> ${prod.ingredients}</p>
                <p style="margin: 2px 0 0 0; font-size: 10px; color: #666;"><strong>Waktu Pakai:</strong> ${prod.waktu || 'Pagi / Malam'}</p>
            </div>
        `;
        listContainer.appendChild(item);
    });

    // Format rangkuman produk untuk dikirim ke email
    const recsForEmail = recommendations.map(r => `- [${r.category}] ${r.nama} (${r.harga})`).join('\n');

    // ==========================================
    // PROSES PENGIRIMAN EMAIL OTOMATIS (EmailJS)
    // ==========================================
    const emailParams = {
        user_name: selectedName,
        skin_type: selectedSkinType.toUpperCase(),
        skin_problems: problemLabels.join(', '),
        recommendations: recsForEmail
    };

    // Ganti 'SERVICE_ID_KAMU' dan 'TEMPLATE_ID_KAMU' dengan milikmu dari EmailJS
    emailjs.send('service_j1vbwgj', 'template_juo9jfn', emailParams)
        .then(() => {
            console.log('✅ Hasil analisa berhasil dikirim ke email!');
        })
        .catch((error) => {
            console.error('❌ Gagal mengirim email:', error);
        });

    document.querySelectorAll('.analisa-step').forEach(el => el.style.display = 'none');
    document.getElementById('analisa-step-result').style.display = 'block';
}

function resetAnalisa() {
    selectedName = ''; selectedSkinType = ''; selectedSkinProblems = [];
    const nameInput = document.getElementById('user-name');
    if (nameInput) nameInput.value = '';
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    if (document.getElementById('btn-next-step3')) document.getElementById('btn-next-step3').style.display = 'none';
    if (document.getElementById('btn-show-result')) document.getElementById('btn-show-result').style.display = 'none';
    document.querySelectorAll('.analisa-step').forEach(el => el.style.display = 'none');
    if (document.getElementById('analisa-step-1')) document.getElementById('analisa-step-1').style.display = 'block';
}

// ==========================================
// 6. LOGIKA KAMUS INGREDIENTS
// ==========================================
function initKamus() {
    const btnBox = document.getElementById('kamus-problem-buttons');
    const list = document.getElementById('ingredients-list');
    if (!btnBox || !list) return;

    btnBox.innerHTML = ''; 
    list.innerHTML = '<p style="text-align:center; color:#888; font-style:italic; margin-top:20px; font-size:12px;">Pilih salah satu permasalahan kulit di atas untuk melihat bahan aktifnya.</p>';
    
    Object.keys(kamusData).forEach(prob => {
        const btn = document.createElement('button');
        btn.className = 'kamus-btn'; 
        btn.innerText = prob;
        btn.onclick = () => {
            playSFX('click');
            document.querySelectorAll('#kamus-problem-buttons .kamus-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            list.innerHTML = '';
            kamusData[prob].forEach(i => {
                const card = document.createElement('div');
                card.className = 'ing-card';
                card.innerHTML = `
                    <strong style="color:#D81B60; font-size:14px;">${i.nama}</strong><br>
                    <span style="font-size:12px; color:#555; display:block; margin-top:4px;">${i.fungsi}</span>
                `;
                card.onclick = () => openIngModal(i);
                list.appendChild(card);
            });
        };
        btnBox.appendChild(btn);
    });
}

function openIngModal(item) {
    playSFX('click');
    document.getElementById('modal-details').innerHTML = `
        <h3 style="color:#D81B60; margin-bottom:8px;">${item.nama}</h3>
        <p style="margin-bottom:6px;"><strong>Fungsi Utama:</strong> ${item.fungsi}</p>
        <p style="margin-bottom:6px;"><strong>Takaran Aman:</strong> ${item.takaran}</p>
        <p style="margin-bottom:0;"><strong>Format Produk:</strong> ${item.cocokDi}</p>
    `;
    document.getElementById('app-modal').style.display = 'flex';
}

// ==========================================
// 7. LOGIKA TIPS & TRICK
// ==========================================
function initTips() {
    const btnBox = document.getElementById('tips-category-buttons');
    const list = document.getElementById('tips-content-list');
    if (!btnBox || !list) return;

    btnBox.innerHTML = '';
    list.innerHTML = '<p style="text-align:center; color:#888; font-style:italic; margin-top:20px; font-size:12px;">Pilih salah satu kondisi kulit di atas untuk melihat panduan perawatannya.</p>';

    Object.keys(tipsData).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'tips-btn';
        btn.innerText = cat;
        btn.onclick = () => {
            playSFX('click');
            document.querySelectorAll('#tips-category-buttons .tips-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            list.innerHTML = '';
            tipsData[cat].forEach(t => {
                const card = document.createElement('div');
                card.className = 'tip-card';
                card.innerHTML = `
                    <strong style="color:#D81B60; font-size:13px;">💡 ${t.judul}</strong>
                    <p style="font-size:12px; color:#444; margin-top:6px; margin-bottom:0; line-height:1.5;">${t.detail}</p>
                `;
                list.appendChild(card);
            });
        };
        btnBox.appendChild(btn);
    });
}

// ==========================================
// 8. BANK SOAL ULTIMATE TRIVIA (80 SOAL)
// ==========================================
const bankSoalL1 = [
    { q: "Apa fungsi utama dari Salicylic Acid?", opt: ["A. Mengeringkan jerawat", "B. Melemebabkan kulit", "C. Menaikkan skin tone", "D. Membuat kulit jadi glowing"], a: 0 },
    { q: "Ingredients apa yang ampuh memudarkan bekas jerawat kehitaman?", opt: ["A. Petroleum Jelly", "B. Alpha Arbutin", "C. Sulfur murni", "D. Alkohol berat"], a: 1 },
    { q: "Ingredients apa yang menjadi kunci utama memperbaiki skin barrier?", opt: ["A. Scrub kasar", "B. Alkohol", "C. Ceramide", "D. Parfum sintetis"], a: 2 },
    { q: "Tekstur Moisturizer apa yang paling cocok untuk kulit sangat kering?", opt: ["A. Bebas apa saja", "B. Watery", "C. Gel", "D. Cream"], a: 3 },
    { q: "Ingredients alternatif Retinol yang aman untuk bumil adalah...", opt: ["A. Benzoyl Peroxide", "B. Bakuchiol", "C. Glycolic Acid", "D. Salicylic Acid murni"], a: 1 },
    { q: "Morning Routine Skincare di pagi hari yang tepat adalah...", opt: ["A. Sunscreen -> Moisturizer", "B. Toner -> Serum -> Moisturizer -> Sunscreen", "C. Moisturizer -> Sunscreen", "D. Serum -> Sunscreen"], a: 1 },
    { q: "Berapa kali idealnya melakukan eksfoliasi dalam seminggu?", opt: ["A. Setiap hari", "B. 7 kali seminggu", "C. 1–2 kali seminggu", "D. Sebulan sekali"], a: 2 },
    { q: "Kapan waktu terbaik memakai Exfoliating Toner?", opt: ["A. Pagi hari", "B. Siang hari", "C. Malam hari", "D. Setiap mau makan"], a: 2 },
    { q: "Apa fungsi utama Ingredient Hyaluronic Acid?", opt: ["A. Menghidrasi kelembapan kulit", "B. Mengangkat kulit mati", "C. Mengeringkan jerawat", "D. Membunuh bakteri"], a: 0 },
    { q: "Zat apa yang berfungsi mengontrol minyak dan menyamarkan pori?", opt: ["A. Coconut Oil", "B. Niacinamide", "C. Vaseline", "D. Olive Oil"], a: 1 },
    { q: "Berapa lama waktu ideal mendiamkan sheet mask di wajah?", opt: ["A. Semalaman", "B. 15–20 menit saja", "C. 1 jam penuh", "D. 5 detik saja"], a: 1 },
    { q: "Apakah vitamin yang berfungsi sebagai antioksidan kuat pencerah kulit?", opt: ["A. Vitamin C", "B. Vitamin B12", "C. Vitamin K", "D. Vitamin D"], a: 0 },
    { q: "Apa akibat jika kulit berminyak diskip penggunaan moisturizernya?", opt: ["A. Kulit sehat", "B. Produksi minyak makin menggila (rebound oil)", "C. Pori mengecil", "D. Jerawat hilang"], a: 1 },
    { q: "Apa nama proses penyesuaian kulit saat awal memakai retinol?", opt: ["A. Skin peeling", "B. Breaking water", "C. Allergic break", "D. Purging"], a: 3 },
    { q: "Manakah jenis sunscreen yang bekerja memantulkan sinar UV seperti cermin?", opt: ["A. Chemical sunscreen", "B. Physical / Mineral sunscreen", "C. Hybrid moisturizer", "D. Gel sunscreen"], a: 1 },
    { q: "Bagaimana cara mencuci muka yang benar untuk kulit berjerawat?", opt: ["A. Digosok sekencang-kencangnya", "B. Dipijat lembut menggunakan gentle cleanser", "C. Disiram air panas 40°", "D. Dibiarkan tanpa dibilas"], a: 1 },
    { q: "Apakah fungsi Centella Asiatica dalam skincare?", opt: ["A. Menenangkan kemerahan dan iritasi", "B. Memutihkan instan", "C. Mengangkat sel kulit mati", "D. Memberi warna glowing"], a: 0 },
    { q: "Ingredients apa yang dikenal bagus untuk merawat kulit kusam?", opt: ["A. Alkohol", "B. Sulfur", "C. Petrolatum", "D. Alpha Arbutin"], a: 3 },
    { q: "Kapan waktu wajib re-apply sunscreen saat di luar ruangan?", opt: ["A. Setiap 2–3 jam sekali", "B. Sekali sehari saja", "C. Seminggu sekali", "D. Setiap 10 menit"], a: 0 },
    { q: "Apa ciri utama jika skin barrier wajah kamu rusak?", opt: ["A. Kulit kusam", "B. Kulit terasa perih, kemerahan, dan gampang jerawatan", "C. Pori membesar", "D. Kulit sangat tipis"], a: 1 }
];

const bankSoalL2 = [
    { q: "1. Manakah Ingredients berikut yang BUKAN berfungsi sebagai skin barrier sekaligus soothing?", opt: ["Salicylic Acid (BHA)", "Ceramide", "Zinc PCA", "Panthenol"], correctIndices: [0, 2] },
    { q: "2. Pilih Ingredients yang termasuk dalam kategori exfoliator!", opt: ["Glycolic Acid", "Salicylic Acid", "Lactic Acid", "Centella Asiatica"], correctIndices: [0, 1, 2] },
    { q: "3. Pilih Ingredients yang terbukti membantu bekas jerawat!", opt: ["Alpha Arbutin", "Niacinamide", "Tranexamic Acid", "Mineral Oil"], correctIndices: [0, 1, 2] },
    { q: "4. Ingredients manakah yang disarankan untuk memperbaiki skin barrier rusak?", opt: ["Ceramide", "High Dose Alcohol", "Panthenol", "Parfum Sintetis"], correctIndices: [0, 2] },
    { q: "5. Produk apa saja yang wajib ada dalam basic skincare routine pagi hari?", opt: ["Moisturizer", "Sunscreen", "Exfoliating Serum", "Face Wash"], correctIndices: [0, 1, 3] },
    { q: "6. Pilih Ingredients dalam moisturizer yang termasuk kelompok humektan penarik air!", opt: ["Hyaluronic Acid", "Petrolatum", "Glycerin", "Beeswax"], correctIndices: [0, 2] },
    { q: "7. Ingredients apa saja yang tidak disarankan dipakai bersamaan dengan Retinol?", opt: ["AHA", "BHA", "High Dose Vitamin C", "Hyaluronic Acid"], correctIndices: [0, 1, 2] },
    { q: "8. Apa saja tanda-tanda jika kulit mengalami Over-Exfoliation?", opt: ["Kulit terasa perih dan kemerahan", "Skin barrier terasa menipis", "Kulit menjadi lebih tebal", "Pori-pori mengecil otomatis"], correctIndices: [0, 1] },
    { q: "9. Manakah Ingredients Brightening yang aman digunakan untuk mengatasi kulit kusam?", opt: ["Vitamin C", "Tranexamic Acid", "Niacinamide", "Alpha Arbutin"], correctIndices: [0, 1, 2, 3] },
    { q: "10. Pilih fungsi utama dari penggunaan Sunscreen di pagi hari!", opt: ["Mencegah penuaan dini", "Mencegah flek hitam", "Melindungi kulit dari radiasi UV", "Mencegah kanker kulit"], correctIndices: [0, 1, 2, 3] },
    { q: "11. Kebiasaan buruk apa saja yang bisa memicu timbulnya jerawat di wajah remaja?", opt: ["Jarang cuci muka setelah berkegiatan", "Sering menyentuh wajah dengan tangan kotor", "Minum air putih cukup", "Rutin mengganti sarung bantal"], correctIndices: [0, 1] },
    { q: "12. Pilih Ingredients skincare yang bersifat soothing / mendinginkan kulit meradang!", opt: ["Allantoin", "Panthenol", "High Concentrate AHA", "Menthol murni 10%"], correctIndices: [0, 1] },
    { q: "13. Faktor apa saja yang memengaruhi cepat/lambatnya hasil skincare di wajah?", opt: ["Konsistensi pemakaian", "Kondisi awal skin barrier", "Genetika", "Gaya hidup"], correctIndices: [0, 1, 2, 3] },
    { q: "14. Dari empat statement ini, manakah yang benar tentang toner?", opt: ["Ada toner hydrating dan exfoliating", "Tekstur Toner watery", "Toner harus diusap dengan scrub kasar", "Toner menggantikan fungsi sunscreen"], correctIndices: [0, 1] },
    { q: "15. Pilih produk yang pas untuk merawat remaja pemula usia sekolah!", opt: ["Gentle cleanser pH seimbang", "Sunscreen ringan", "Moisturizer barrier", "Retinol 2% High Dose"], correctIndices: [0, 1, 2] },
    { q: "16. Apa saja kondisi yang mengharuskan kamu melakukan Double Cleansing?", opt: ["Setelah memakai makeup waterproof", "Setelah re-apply sunscreen seharian", "Bangun tidur tanpa pakai produk malam", "Saat cuci muka di tengah mandi pagi"], correctIndices: [0, 1] },
    { q: "17. Cara untuk mengaplikasikan serum wajah adalah...", opt: ["Diteteskan di telapak tangan lalu ditepuk perlahan ke wajah", "Diteteskan dengan pipet langsung ke area kulit", "Digosok kasar dengan kapas", "Dibiarkan mengering di pipet"], correctIndices: [0, 1] },
    { q: "18. Manakah dari produk berikut yang teksturnya thick saat diaplikasikan?", opt: ["Serum Hyaluronic Acid murni", "Moisturizer dengan Glycerin tinggi", "Micellar Water", "Watery Toner"], correctIndices: [0, 1] },
    { q: "19. Apa fungsi dari ingredients antioksidan seperti Vitamin E dan Green Tea dalam skincare pagi?", opt: ["Mencegah kerusakan sel akibat radikal bebas", "Membantu meningkatkan kinerja sunscreen", "Menenangkan kulit dari polusi", "Mengikis lapisan epidermis"], correctIndices: [0, 1, 2] },
    { q: "20. Jika kamu memiliki kulit berminyak, hal apa yang sebaiknya dihindari dalam layer penggunaan produk?", opt: ["Fragrance berlebihan", "Mineral Oil berat", "Alkohol", "Centella Asiatica"], correctIndices: [0, 1, 2] }
];

const bankSoalL3 = [
    { q: "1. Sinta memiliki kulit berjerawat dan sensitif. Sepulang sekolah ia membersihkan wajah dengan micellar water lalu facial wash. Malam sebelum tidur, ia mengulanginya lagi dan melakukan deep cleansing berulang kali karena menganggap semakin sering membersihkan wajah dengan produk bagus akan semakin cepat jerawatnya hilang. Tindakan Sinta adalah...?", a: false },
    { q: "2. Aiman (15 tahun) punya banyak jerawat mendem. Ia rutin menggunakan Gentle Cleanser, Gel Moisturizer berbahan Centella Asiatica, dan Chemical Sunscreen di pagi hari. Malam harinya ia memakai spot treatment berbahan sulfur di area jerawat mendemnya. Tindakan Aiman adalah...?", a: true },
    { q: "3. Naisila merasa kulitnya sangat kering dan mengelupas akibat cuaca panas. Di rumah, ia memakai Hydrating Toner 3 layer, lalu saat kulit masih agak lembap ia menguncinya dengan Rich Moisturizer mengandung Hyaluronic Acid & Ceramide. Tindakan Naisila secara keseluruhan adalah...?", a: true },
    { q: "4. Alam ingin mencerahkan kulit kusamnya setelah liburan. Karena ingin cepat, ia mencampurkan Serum 15% Vitamin C dengan perasan buah jeruk lalu mengoleskannya ke seluruh wajah dan mendiamkannya 20 menit sebelum dibilas. Tindakan Alam adalah...?", a: false },
    { q: "5. Fida baru mencoba eksfoliasi pertama kali dengan toner AHA. Karena tidak merasa cekit-cekit, ia menganggap produk tidak bekerja lalu menambahkan toner berkali-kali ke kapas dan menggosoknya kencang-kencang ke area hidung dan pipi. Tindakan Fida adalah...?", a: false },
    { q: "6. Gigih selalu rajin memakai sunscreen 2 jari jam 6 pagi. Namun meski aktif ekstrakurikuler hingga jam 5 sore dan berkeringat, ia tidak pernah re-apply dengan alasan sunscreen pagi masih melekat dan terasa cukup. Tindakan Gigih adalah...?", a: false },
    { q: "7. Danika baru membeli Moisturizer berbahan Squalane dan Niacinamide. Sebelum mengoleskannya ke seluruh wajah, ia melakukan patch test di area belakang telinga/rahang selama 24 jam untuk melihat apakah ada reaksi alergi. Tindakan Danika adalah...?", a: true },
    { q: "8. Aini memiliki wajah sangat berminyak. Untuk mengatasinya, ia tidak pernah memakai Moisturizer karena menganggap kulitnya sudah lembap oleh minyak, dan hanya menyemprotkan face mist siang-malam sebagai pengganti Moisturizer. Tindakan Aini adalah...?", a: false },
    { q: "9. Ayubi mengalami jerawat besar kemerahan di dahi. Malam harinya setelah mencuci muka dan mengaplikasikan basic skincare, ia menempelkan Acne Patch di atas jerawat tersebut dan membiarkannya semalaman untuk menyerap cairan. Tindakan Ayubi adalah...?", a: true },
    { q: "10. Ibu kamu sedang hamil/menyusui dan menggunakan Serum Retinol 2% untuk mengatasi keriput. Saat mengetahuinya, kamu membiarkannya saja karena menganggap alasannya cukup masuk akal. Tindakan kamu membiarkannya adalah...?", a: false }
];

// ==========================================
// 9. TRIVIA GAME ENGINE
// ==========================================
let triviaState = { 
    playerName: '', 
    level: 1, 
    lives: 5, 
    currentIndex: 0, 
    timer: null, 
    timeLeft: 10, 
    questions: [], 
    multiAnswers: [] 
};

function initTrivia() {
    stopBGM();
    if (triviaState.timer) clearInterval(triviaState.timer);
    
    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="padding: 20px; text-align:center;">
            <h3 style="color: #D81B60; font-size: 16px; margin-bottom: 12px;">Selamat Datang di Trivia Skincare!</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">Silakan masukkan nama kamu sebelum memulai tantangan:</p>
            <input type="text" id="trivia-name-input" class="form-input" placeholder="Masukkan nama kamu..." value="${localStorage.getItem('playerName') || ''}">
            <button class="menu-btn" onclick="playSFX('click'); setTriviaName()">Lanjut ke Penjelasan &rarr;</button>
        </div>
    `;
}

function setTriviaName() {
    const input = document.getElementById('trivia-name-input');
    const name = input ? input.value.trim() : '';
    if (name) { 
        triviaState.playerName = name; 
        localStorage.setItem('playerName', triviaState.playerName);
        showLevelRules(1); 
    } else {
        alert("Harap masukkan nama terlebih dahulu!");
    }
}

function showLevelRules(lvl) {
    let title = "", typeText = "", time = 0, lives = 0, total = 0;
    if (lvl === 1) { title = "Rookie"; typeText = "Pilihan Ganda (Single Choice)"; time = 10; lives = 5; total = 20; }
    if (lvl === 2) { title = "Middle"; typeText = "Multi-Selection (Pilih > 1 Jawaban)"; time = 10; lives = 5; total = 10; }
    if (lvl === 3) { title = "Expert"; typeText = "Analisa Kasus (Benar / Salah)"; time = 15; lives = 3; total = 10; }

    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="padding: 20px; text-align:left;">
            <h3 style="color: #D81B60; font-size: 18px; text-align:center;">Halo ${triviaState.playerName}! 👋</h3>
            <div style="background: #FFF; border: 2px solid #F8BBD0; border-radius: 12px; padding: 15px; margin: 15px 0;">
                <h4 style="color:#D81B60; margin-bottom: 8px; font-size:15px;">Sistem Level ${lvl}: ${title}</h4>
                <p style="font-size: 12px; color:#444; margin-bottom: 4px;"><strong>• Tipe Soal:</strong> ${typeText}</p>
                <p style="font-size: 12px; color:#444; margin-bottom: 4px;"><strong>• Jumlah Soal:</strong> ${total} Pertanyaan</p>
                <p style="font-size: 12px; color:#444; margin-bottom: 4px;"><strong>• Waktu Jawab:</strong> ${time} Detik / Soal</p>
                <p style="font-size: 12px; color:#444; margin-bottom: 0;"><strong>• Kesempatan Nyawa:</strong> ${lives} ❤️</p>
            </div>
            <p style="font-size:11px; color:#888; font-style:italic; text-align:center;">Catatan: Jika Game Over di Level mana pun, kamu harus mengulang dari Level 1!</p>
            <button class="menu-btn" style="margin-top:10px;" onclick="playSFX('click'); startCountdownSequence(${lvl})">Mulai Level ${lvl} ✨</button>
        </div>
    `;
}

function startCountdownSequence(lvl) {
    let count = 3;
    const container = document.getElementById('trivia-container');
    
    const countTimer = setInterval(() => {
        playSFX('countdown');
        container.innerHTML = `
            <div class="trivia-box" style="padding: 40px; text-align:center;">
                <h3 style="color:#D81B60; font-size:14px; margin-bottom:10px;">Bersiaplah...</h3>
                <h1 style="font-size: 60px; color:#E91E63; margin:0;">${count}</h1>
            </div>
        `;
        count--;
        if (count < 0) {
            clearInterval(countTimer);
            startTriviaLevel(lvl);
        }
    }, 1000);
}

function startTriviaLevel(lvl) {
    triviaState.level = lvl;
    triviaState.currentIndex = 0;
    
    if (lvl === 1) {
        triviaState.lives = 5;
        triviaState.timeLeft = 10;
        
        let rawQuestions = shuffleArray(bankSoalL1).slice(0, 20);
        triviaState.questions = rawQuestions.map((qObj, index) => {
            let cleanQuestionText = qObj.q.replace(/^\d+\.\s*/, '');
            return {
                ...qObj,
                q: `${index + 1}. ${cleanQuestionText}`
            };
        });
    } else if (lvl === 2) {
        triviaState.lives = 5;
        triviaState.timeLeft = 10;
        triviaState.questions = shuffleArray(bankSoalL2).slice(0, 10);
    } else if (lvl === 3) {
        triviaState.lives = 3;
        triviaState.timeLeft = 15;
        triviaState.questions = shuffleArray(bankSoalL3).slice(0, 10);
    }
    
    initAudio(); 
    bgmAudio.currentTime = 0;
    bgmAudio.play().catch(()=>{});
    renderQuestionCard();
}

function renderQuestionCard() {
    if (triviaState.timer) clearInterval(triviaState.timer);
    
    const q = triviaState.questions[triviaState.currentIndex];
    const container = document.getElementById('trivia-container');
    triviaState.multiAnswers = [];
    triviaState.timeLeft = (triviaState.level === 3) ? 15 : 10;

    let inputHTML = '';
    if (triviaState.level === 1) {
        inputHTML = q.opt.map((o, idx) => `
            <button class="option-btn" style="font-size:12px; margin-bottom:8px; text-align:left;" onclick="submitAnswer('abcd', ${idx})">${o}</button>
        `).join('');
    } else if (triviaState.level === 2) {
        inputHTML = q.opt.map((o, idx) => `
            <button class="option-btn" id="multi-opt-${idx}" style="font-size:12px; margin-bottom:8px; text-align:left;" onclick="toggleMultiTrivia(${idx})">${o}</button>
        `).join('') + `<button class="menu-btn" style="margin-top:10px;" onclick="submitAnswer('multi', null)">Jawab Sekarang &rarr;</button>`;
    } else if (triviaState.level === 3) {
        inputHTML = `
            <div style="display:flex; gap:10px; margin-top:15px;">
                <button class="option-btn" style="background:#E8F5E9; color:#2E7D32; border-color:#A5D6A7;" onclick="submitAnswer('tf', true)">BENAR</button>
                <button class="option-btn" style="background:#FFEBEE; color:#C62828; border-color:#EF9A9A;" onclick="submitAnswer('tf', false)">SALAH</button>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="trivia-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-weight:bold; font-size:12px; color:#555;">
                <span style="color:#D81B60;">Level ${triviaState.level} (${triviaState.currentIndex + 1}/${triviaState.questions.length})</span>
                <span style="background:#FFF0F3; color:#D81B60; padding:2px 8px; border-radius:10px;">⏳ <strong id="timer-display">${triviaState.timeLeft}</strong>s</span>
                <span>Nyawa: ${'❤️'.repeat(triviaState.lives)}</span>
            </div>
            <p style="margin:12px 0 15px 0; font-size:13px; font-weight:600; line-height:1.5; color:#333;">${q.q}</p>
            ${inputHTML}
        </div>
    `;

    triviaState.timer = setInterval(() => {
        triviaState.timeLeft--;
        const timerEl = document.getElementById('timer-display');
        if (timerEl) timerEl.innerText = triviaState.timeLeft;

        if (triviaState.timeLeft <= 0) {
            clearInterval(triviaState.timer);
            submitAnswer('timeout', null);
        }
    }, 1000);
}

function toggleMultiTrivia(idx) {
    playSFX('click');
    const btn = document.getElementById(`multi-opt-${idx}`);
    const pos = triviaState.multiAnswers.indexOf(idx);

    if (pos > -1) {
        triviaState.multiAnswers.splice(pos, 1);
        btn.classList.remove('selected');
    } else {
        triviaState.multiAnswers.push(idx);
        btn.classList.add('selected');
    }
}

function submitAnswer(type, val) {
    if (triviaState.timer) clearInterval(triviaState.timer);
    
    const q = triviaState.questions[triviaState.currentIndex];
    let isCorrect = false;

    if (type === 'abcd' || type === 'tf') isCorrect = (val === q.a);
    if (type === 'multi') {
        const selected = triviaState.multiAnswers.sort().join(',');
        const correct = q.correctIndices.sort().join(',');
        isCorrect = (selected === correct);
    }
    if (type === 'timeout') isCorrect = false;

    if (isCorrect) {
        playSFX('correct');
    } else {
        playSFX('wrong');
        triviaState.lives--;
    }

    if (triviaState.lives <= 0) {
        playSFX('gameOver');
        stopBGM();

        document.getElementById('trivia-container').innerHTML = `
            <div class="trivia-box" style="padding: 25px 20px; text-align:center;">
                <h2 style="color:#D81B60;">Game Over! 💔</h2>
                <p style="font-size:13px; color:#555; margin: 10px 0;">Nyawa kamu habis di Level ${triviaState.level}. Sesuai sistem, kamu harus mengulang dari Level 1!</p>
                <button class="menu-btn" onclick="playSFX('click'); showLevelRules(1)">Mulai Ulang dari Level 1</button>
            </div>
        `;
        return;
    }

    triviaState.currentIndex++;
    if (triviaState.currentIndex >= triviaState.questions.length) {
        levelUpSequence();
    } else {
        renderQuestionCard();
    }
}

function levelUpSequence() {
    playSFX('levelUp');
    
    let currentUnlocked = parseInt(localStorage.getItem('skincare_unlocked_level') || 0);
    if (triviaState.level > currentUnlocked) {
        localStorage.setItem('skincare_unlocked_level', triviaState.level);
    }

    const container = document.getElementById('trivia-container');
    if (triviaState.level < 3) {
        container.innerHTML = `
            <div class="trivia-box" style="padding: 25px 20px; text-align:center;">
                <h2 style="color:#D81B60;">Selamat! 🎉</h2>
                <p style="font-size:13px; margin:10px 0;">Kamu berhasil menyelesaikan Level ${triviaState.level} dan membuka Badge baru!</p>
                <button class="menu-btn" onclick="playSFX('click'); showLevelRules(${triviaState.level + 1})">Lanjut ke Level ${triviaState.level + 1} &rarr;</button>
            </div>
        `;
    } else {
        stopBGM();
        container.innerHTML = `
            <div class="trivia-box" style="padding: 25px 20px; text-align:center;">
                <h2 style="color:#D81B60;">TAMAT! 🏆</h2>
                <p style="font-size:13px; margin:10px 0;">Kamu resmi menyelesaikan seluruh level dan meraih Badge Expert Skincare!</p>
                <button class="menu-btn" onclick="playSFX('click'); switchScreen('home-screen')">Kembali ke Beranda</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderHomeBadges();
    checkUpdatePopup();
});