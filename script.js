// ==========================================
// 0. AUDIO ENGINE & BGM MP3 INTEGRATION
// ==========================================
const bgmAudio = new Audio('bgm.mp3');
bgmAudio.loop = true;
bgmAudio.volume = 0.15;

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
        
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) { console.log(e); }
}

function playSFX(type) {
    initAudio();
    if (type === 'correct') playTone(600, 1200, 'sine', 0.25);
    else if (type === 'wrong') playTone(220, 110, 'sawtooth', 0.35);
    else if (type === 'countdown') playTone(440, 440, 'sine', 0.1);
    else if (type === 'start') playTone(587.33, 880, 'triangle', 0.3);
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

// ==========================================
// 1. DATABASE LATAR BELAKANG (PRODUCTS)
// ==========================================
const skincareDatabase = {
    "Facewash": [
        { img: "facewash1.jpg", nama: "Facewash Hanasui Pink", harga: "25rb", ukuran: "60ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid", review: "Daya bersihin cukup oke dan gabikin kering after bilas." },
        { img: "facewash2.jpg", nama: "Facewash Hanasui Hijau", harga: "25rb", ukuran: "60ml", cocok: "Kombinasi, Beruntusan dan Berjerawat", ingredients: "Nano Salicylic Acid, Centella Asiatica, Panthenol", review: "Ampuh banget buat jerawat dan gabikin kering." },
        { img: "facewash3.jpg", nama: "Facewash Hadalabo Putih Gokujyun", harga: "42rb", ukuran: "100ml", cocok: "Sangat Kering", ingredients: "2 Tipe Hyaluronic Acid", review: "Andalan kulit super kering, bikin lembut banget." },
        { img: "facewash5.jpg", nama: "Facewash Y.O.U Hijau", harga: "36rb", ukuran: "100ml", cocok: "Sangat Berminyak, Berjerawat, Beruntusan", ingredients: "1,5% Salicylic Acid, Amino Acid", review: "Cocok banget buat kulit berminyak & Acne Prone Skin." }
    ],
    "Toner": [
        { img: "toner1.jpg", nama: "Toner Hanasui Pink", harga: "30rb", ukuran: "105ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", ingredients: "Advance Niacinamide, Genowhite, 8 Hyaluronate", review: "Melembabkan dan menutrisi kulit secara berkala." },
        { img: "toner2.jpg", nama: "Toner Autumn Ungu", harga: "50rb", ukuran: "500ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", ingredients: "5% Niacinamide, Vitamin C, Alpha Arbutin, Tranexamic Acid", review: "Ampuh mencerahkan kulit kusam & bekas jerawat, porsi jumbo!" },
        { img: "toner3.jpg", nama: "Toner Autumn Hijau", harga: "60rb", ukuran: "500ml", cocok: "Berminyak, Berjerawat dan Beruntusan", ingredients: "Salicylic Acid, Centella Asiatica", review: "Bagus buat menenangkan jerawat dan merawat pori." }
    ],
    "Serum": [
        { img: "serum1.jpg", nama: "Serum Hanasui Brightening", harga: "30rb", ukuran: "20ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", ingredients: "10% Advanced Niacinamide", review: "Mencerahkan kulit jika dipakai secara rutin." },
        { img: "serum2.jpg", nama: "Serum Hanasui Acne", harga: "25rb", ukuran: "20ml", cocok: "Berminyak, Berjerawat, Beruntusan", ingredients: "0,5% Salicylic Acid, Centella, Niacinamide", review: "Lumayan ngefek buat meredakan jerawat aktif." },
        { img: "serum5.jpg", nama: "Serum Somethinc Pink", harga: "120rb", ukuran: "20ml", cocok: "Sangat berminyak, Beruntusan, Komedo", ingredients: "2% Salicylic Acid", review: "Bener-bener ampuh buat menghempas jerawat & komedo!" }
    ],
    "Moisturizer": [
        { img: "moist1.jpg", nama: "Moisturizer Hanasui Hijau", harga: "38rb", ukuran: "30ml", cocok: "Kering, Skin Barrier Rusak, Sensitif", ingredients: "5x Ceramide, Niacinamide, Hyaluronic Acid", review: "Juara buat merawat skin barrier dan menenangkan kulit." },
        { img: "moist2.jpg", nama: "Moisturizer Hanasui Orange", harga: "38rb", ukuran: "30ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", ingredients: "5x Ceramide, 5% Niacinamide, Tranexamic Acid", review: "Bagus buat melembabkan sekaligus mencerahkan." }
    ],
    "Sunscreen": [
        { img: "sunscreen1.jpg", nama: "Sunscreen Hanasui SPF 30 PA+++", harga: "28rb", ukuran: "30ml", cocok: "Kombinasi, Kering", ingredients: "Chemical UV Filters, Vitamin E", review: "Ringan, pemula friendly, dan ga bikin whitecast." },
        { img: "sunscreen5.jpg", nama: "Sunscreen Acnaway SPF 35 PA+++", harga: "40rb", ukuran: "30ml", cocok: "Berminyak, Berjerawat", ingredients: "Chemical UV Filters, Centella, Salicylic Acid", review: "Matte finish, cocok buat kulit berminyak biar ga makin greasy." }
    ]
};

// ==========================================
// 2. DATABASE KAMUS INGREDIENTS
// ==========================================
const kamusData = {
    "Jerawat & Beruntusan": [
        { nama: "Salicylic Acid (BHA)", fungsi: "Membersihkan pori tersumbat, eksfoliasi minyak, meredakan radang.", takaran: "0.5% - 2%", cocokDi: "Serum / Exfoliating Toner / Facewash" },
        { nama: "Centella Asiatica", fungsi: "Menenangkan kemerahan, iritasi, dan mempercepat pemulihan jerawat.", takaran: "Pure Cica Extract", cocokDi: "Serum / Moisturizer / Toner" },
        { nama: "Sulfur (Belerang)", fungsi: "Mengeringkan jerawat aktif dengan cepat dan menyerap kelebihan sebum.", takaran: "1% - 5%", cocokDi: "Spot Treatment / Masker" },
        { nama: "Tea Tree Oil", fungsi: "Antimikroba alami untuk melawan bakteri penyebab jerawat.", takaran: "0.5% - 1%", cocokDi: "Spot Treatment / Serum" },
        { nama: "Benzoyl Peroxide", fungsi: "Membunuh bakteri jerawat hingga ke dalam pori-pori.", takaran: "2.5% - 5%", cocokDi: "Spot Treatment / Acne Gel" },
        { nama: "Azelaic Acid", fungsi: "Anti-inflamasi meredakan jerawat meradang dan mengurangi kemerahan.", takaran: "5% - 10%", cocokDi: "Serum / Cream" }
    ],
    "Kulit Berminyak & Pori": [
        { nama: "Salicylic Acid (BHA)", fungsi: "Mengontrol produksi sebum berlebih di dalam pori-pori.", takaran: "0.5% - 2%", cocokDi: "Exfoliating Toner / Serum" },
        { nama: "Niacinamide", fungsi: "Mengatur produksi minyak dan menyamarkan tampilan pori besar.", takaran: "2% - 10%", cocokDi: "Serum / Moisturizer" },
        { nama: "Zinc PCA", fungsi: "Menyeimbangkan sebum dan mengurangi kilap berlebih di wajah.", takaran: "0.5% - 1%", cocokDi: "Serum / Toner" },
        { nama: "Green Tea Extract", fungsi: "Antioksidan mengontrol kilap minyak dan menenangkan kulit.", takaran: "1% - 3%", cocokDi: "Toner / Gel Moisturizer" },
        { nama: "Witch Hazel", fungsi: "Astringent alami meringkas pori-pori dan menyegarkan kulit.", takaran: "2% - 5%", cocokDi: "Toner / Mist" }
    ],
    "Kusam & Bekas Jerawat": [
        { nama: "Niacinamide", fungsi: "Mencerahkan kulit kusam, menyamarkan noda hitam, meratakan warna kulit.", takaran: "2% - 10%", cocokDi: "Serum / Moisturizer" },
        { nama: "Alpha Arbutin", fungsi: "Menghambat enzim tyrosinase memudarkan bekas jerawat kehitaman.", takaran: "1% - 2%", cocokDi: "Serum / Toner" },
        { nama: "Vitamin C", fungsi: "Antioksidan tinggi mencerahkan dan memberi efek glowing seketika.", takaran: "5% - 15%", cocokDi: "Serum" },
        { nama: "Tranexamic Acid", fungsi: "Menghambat pembentukan pigmen gelap akibat bekas jerawat membandel.", takaran: "2% - 5%", cocokDi: "Serum / Moisturizer" },
        { nama: "Kojic Acid", fungsi: "Mencerahkan kulit berbercak hitam dan meratakan hiperpigmentasi.", takaran: "1% - 2%", cocokDi: "Serum / Cleanser" },
        { nama: "Licorice Root Extract", fungsi: "Pencerah alami yang sekaligus menenangkan kulit kusam & sensitif.", takaran: "0.5% - 2%", cocokDi: "Toner / Essence" }
    ],
    "Skin Barrier & Sensitif": [
        { nama: "Ceramide", fungsi: "Memperbaiki dan memperkuat lapisan pelindung kulit (skin barrier).", takaran: "5x Ceramide Complex", cocokDi: "Moisturizer / Facewash" },
        { nama: "Panthenol (Pro-Vitamin B5)", fungsi: "Menghidrasi mendalam dan menenangkan kulit reaktif/iritasi.", takaran: "1% - 5%", cocokDi: "Moisturizer / Toner" },
        { nama: "Allantoin", fungsi: "Mendinginkan kulit meradang, kemerahan, atau kasar.", takaran: "0.1% - 0.5%", cocokDi: "Moisturizer / Calming Gel" },
        { nama: "Beta-Glucan", fungsi: "Kelembapan ekstra dan mempercepat pemulihan sel kulit rusak.", takaran: "0.1% - 1%", cocokDi: "Serum / Moisturizer" },
        { nama: "Colloidal Oatmeal", fungsi: "Meredakan gatal, kemerahan, menenangkan kulit sangat sensitif.", takaran: "1% - 5%", cocokDi: "Moisturizer / Cleanser" }
    ],
    "Kulit Sangat Kering": [
        { nama: "Hyaluronic Acid", fungsi: "Menarik kelembapan dari udara dan mengikat air agar kulit plumpy.", takaran: "2x - 8x Hyaluronate", cocokDi: "Toner / Serum / Moisturizer" },
        { nama: "Glycerin", fungsi: "Humektan klasik menjaga kelembapan alami kulit sepanjang hari.", takaran: "2% - 10%", cocokDi: "Semua jenis produk" },
        { nama: "Squalane", fungsi: "Minyak ringan penahan hidrasi tanpa menyumbat pori-pori.", takaran: "1% - 5%", cocokDi: "Face Oil / Moisturizer" },
        { nama: "Shea Butter", fungsi: "Kelembapan intensif mengunci air pada kulit sangat kering/pecah.", takaran: "2% - 10%", cocokDi: "Rich Cream / Body Lotion" },
        { nama: "Urea", fungsi: "Melembutkan tekstur kulit yang sangat kering, bersisik, atau mengelupas.", takaran: "5% - 10%", cocokDi: "Moisturizer" }
    ],
    "Anti-Aging & Tekstur": [
        { nama: "Retinol", fungsi: "Mempercepat regenerasi sel, menyamarkan garis halus, merangsang kolagen.", takaran: "0.1% - 0.5%", cocokDi: "Night Serum / Night Cream" },
        { nama: "Bakuchiol", fungsi: "Alternatif retinol nabati yang aman untuk kulit sensitif/bumil.", takaran: "0.5% - 2%", cocokDi: "Serum / Face Oil" },
        { nama: "Glycolic Acid (AHA)", fungsi: "Eksfoliasi permukaan kulit mati mengatasi tekstur kulit kasar.", takaran: "5% - 10%", cocokDi: "Exfoliating Toner" },
        { nama: "Peptides", fungsi: "Asam amino menjaga kekencangan dan elastisitas kulit.", takaran: "1% - 3%", cocokDi: "Anti-Aging Serum" },
        { nama: "Lactic Acid (AHA)", fungsi: "Eksfoliasi lembut mencerahkan sekaligus melembapkan kulit kering.", takaran: "5% - 10%", cocokDi: "Exfoliating Toner / Serum" }
    ]
};

// ==========================================
// 3. BANK SOAL TRIVIA (DENGAN PEMBAHASAN LENGKAP LEVEL 1 - 5)
// ==========================================
const triviaLevels = {
    1: {
        title: "Level 1: Pemula (Benar / Salah)",
        time: 5, lives: 3, selectCount: 10, type: "tf",
        questions: [
            { q: "Sunscreen wajib digunakan pagi hari meskipun hanya di dalam rumah.", a: true, exp: "Sinar UVA dari matahari tetap dapat menembus kaca jendela dan merusak kulit." },
            { q: "Mencuci muka 5 kali sehari dengan facewash bikin kulit makin sehat.", a: false, exp: "Cuci muka berlebihan justru merusak skin barrier dan memicu kulit makin berminyak (rebound oil)." },
            { q: "Toner dan Serum fungsinya sama persis.", a: false, exp: "Toner berfokus untuk menyeimbangkan pH & hidrasi awal, sedangkan serum menutrisi dengan konsentrasi bahan aktif tinggi." },
            { q: "Ceramide membantu memperkuat skin barrier yang rusak.", a: true, exp: "Ceramide adalah komponen utama lemak alami kulit yang menyusun pelindung skin barrier." },
            { q: "Eksfoliasi wajah bagus dilakukan setiap hari pagi dan malam.", a: false, exp: "Eksfoliasi harian memicu over-exfoliation, idealnya cukup 2-3 kali seminggu." },
            { q: "Retinol disarankan untuk digunakan pada malam hari.", a: true, exp: "Retinol bersifat foto-sensitif dan mudah terurai oleh sinar matahari, serta memicu regenerasi sel saat tidur." },
            { q: "Moisturizer gel lebih cocok untuk kulit berminyak.", a: true, exp: "Moisturizer berbasis gel bertekstur ringan, cepat meresap, dan tidak menyumbat pori." },
            { q: "Efek pencerah langsung setelah cuci muka biasanya bersifat permanen.", a: false, exp: "Itu hanya efek sementara dari pembersihan kotoran, bukan perubahan pigmen permanen." },
            { q: "Double cleansing menggunakan micellar water membantu membersihkan sisa sunscreen.", a: true, exp: "Sunscreen dan makeup tahan air tidak cukup dibersihkan hanya dengan facial wash biasa." },
            { q: "Salicylic Acid adalah bahan yang sangat cocok untuk kulit super kering.", a: false, exp: "Salicylic Acid (BHA) bersifat mengontrol minyak, sehingga lebih cocok untuk kulit berminyak dan berjerawat." },
            { q: "Menggunakan moisturizer hukumnya wajib untuk semua jenis kulit.", a: true, exp: "Semua jenis kulit butuh menjaga kadar air agar tidak dehidrasi, termasuk kulit berminyak." },
            { q: "Jerawat aktif boleh discrub kasar agar cepat pecah.", a: false, exp: "Scrub kasar pada jerawat aktif akan memicu peradangan parah dan menyebarkan bakteri." },
            { q: "Sinar UV tetap bisa menembus kaca jendela rumah.", a: true, exp: "Sinar UVA bergelombang panjang mampu menembus kaca dan awan dengan mudah." },
            { q: "Semakin mahal produk skincare, sudah pasti semakin cocok di wajah.", a: false, exp: "Kecocokan skincare bergantung pada kandungan dan kondisi kulit, bukan harga." },
            { q: "Purging biasanya terjadi saat mencoba bahan eksfoliasi atau retinol.", a: true, exp: "Purging adalah proses penyesuaian di mana kotoran di dalam pori terdorong keluar sebagai jerawat kecil sementara." },
            { q: "Masker wajah boleh dipakai tidur semalaman setiap hari.", a: false, exp: "Kecuali sleeping mask khusus, masker biasa yang dibiarkan semalaman akan menyerap kembali kelembapan kulit." },
            { q: "Niacinamide berfungsi membantu mencerahkan kulit.", a: true, exp: "Niacinamide efektif menghambat transfer melanin ke permukaan kulit dan meratakan warna kulit." },
            { q: "Kulit berminyak tidak perlu pakai moisturizer lagi.", a: false, exp: "Kulit berminyak yang kekurangan hidrasi justru akan memproduksi minyak semakin banyak." },
            { q: "Re-apply sunscreen idealnya dilakukan setiap 3-4 jam sekali.", a: true, exp: "Efektivitas perlindungan UV filter pada sunscreen akan menurun seiring berjalannya waktu dan keringat." },
            { q: "Vitamin C disarankan disimpan di tempat sejuk terhindar dari matahari.", a: true, exp: "Vitamin C mudah teroksidasi jika terkena panas dan cahaya matahari langsung." }
        ]
    },
    2: {
        title: "Level 2: Pemula (Fungsi Ingredients)",
        time: 5, lives: 3, selectCount: 10, type: "single",
        questions: [
            { q: "Apa fungsi utama dari Salicylic Acid (BHA)?", opt: ["Membersihkan pori tersumbat & jerawat", "Mengunci air untuk kulit super kering"], a: 0, exp: "Salicylic Acid adalah BHA larut minyak yang ampuh menembus pori-pori untuk membersihkan sumbatan." },
            { q: "Bahan apa yang ampuh mencerahkan bekas jerawat kehitaman?", opt: ["Sulfur & Petroleum Jelly", "Niacinamide & Alpha Arbutin"], a: 1, exp: "Niacinamide dan Alpha Arbutin bekerja sinergis memudarkan hiperpigmentasi dan noda hitam." },
            { q: "Kandungan apa yang menjadi kunci utama memperbaiki skin barrier?", opt: ["Ceramide", "Physical Scrub kasar"], a: 0, exp: "Ceramide mengembalikan ikatan sel kulit yang rusak agar tidak mudah iritasi." },
            { q: "Tekstur pelembap apa yang paling cocok untuk kulit sangat kering?", opt: ["Watery Gel ringan", "Cream kental / Rich Cream"], a: 1, exp: "Rich cream memberikan kelembapan ekstra dan mengunci hidrasi lebih lama pada kulit kering." },
            { q: "Bahan aktif apa yang berfungsi sebagai alternatif Retinol aman untuk bumil?", opt: ["Bakuchiol", "Benzoyl Peroxide dosis tinggi"], a: 0, exp: "Bakuchiol adalah ekstrak tumbuhan yang memberikan manfaat anti-aging serupa retinol tanpa efek samping bagi bumil." },
            { q: "Kandungan mana yang ampuh menyerap minyak berlebih & mengeringkan jerawat?", opt: ["Hyaluronic Acid", "Sulfur (Belerang)"], a: 1, exp: "Sulfur memiliki sifat antiseptik alami yang menyerap minyak dan mengeringkan jerawat aktif dengan cepat." },
            { q: "Apa fungsi utama kandungan Hyaluronic Acid?", opt: ["Menarik kelembapan & menghidrasi kulit", "Mengelupas sel kulit mati secara kasar"], a: 0, exp: "Hyaluronic Acid adalah humektan kuat yang mengikat air hingga 1000x berat molekulnya." },
            { q: "Bahan penenang apa yang cocok untuk meredakan kemerahan iritasi?", opt: ["High Dose AHA", "Centella Asiatica (Cica)"], a: 1, exp: "Centella Asiatica sangat terkenal dengan efek calming untuk menenangkan kulit reaktif." },
            { q: "Kandungan pencerah yang bekerja menghambat enzim pembentuk melanin adalah...", opt: ["Mineral Oil", "Alpha Arbutin"], a: 1, exp: "Alpha Arbutin menekan enzim tyrosinase agar tidak memproduksi pigmen gelap berlebih." },
            { q: "Jenis sunscreen yang tidak meninggalkan bekas putih (whitecast) adalah...", opt: ["Chemical Sunscreen", "Physical Sunscreen"], a: 0, exp: "Chemical sunscreen menyerap ke dalam kulit dan bekerja tanpa meninggalkan lapisan putih di permukaan." },
            { q: "Zinc PCA dalam skincare berfungsi untuk...", opt: ["Menambah lapisan minyak tebal", "Mengontrol produksi sebum berlebih"], a: 1, exp: "Zinc PCA membantu menyeimbangkan kelenjar minyak dan mengurangi kilap di wajah." },
            { q: "Bahan eksfoliasi lembut yang cocok untuk kulit kering adalah...", opt: ["Lactic Acid (AHA)", "High Concentrate BHA"], a: 0, exp: "Lactic Acid adalah AHA yang sekaligus memiliki sifat melembapkan, ramah untuk kulit kering." },
            { q: "Kandungan yang berfungsi mengunci kelembapan tanpa menyumbat pori adalah...", opt: ["Coconut Oil", "Squalane"], a: 1, exp: "Squalane adalah emolien ringan non-comedogenic penahan hidrasi yang nyaman di kulit." },
            { q: "Antioksidan tinggi yang membantu mencerahkan dan meratakan warna kulit adalah...", opt: ["Vitamin C", "Alcohol Denat"], a: 0, exp: "Vitamin C menangkal radikal bebas dan mencerahkan kulit kusam secara optimal." },
            { q: "Tranexamic Acid sangat efektif untuk mengatasi masalah...", opt: ["Kulit pecah-pecah bersisik", "Hiperpigmentasi & bekas jerawat"], a: 1, exp: "Tranexamic Acid sangat ampuh meredakan noda hitam membandel akibat bekas jerawat." },
            { q: "Kandungan yang memberikan sensasi mendinginkan kulit iritasi adalah...", opt: ["Allantoin", "Retinol 1%"], a: 0, exp: "Allantoin bekerja sebagai agen soothing yang menyejukkan kulit kasar dan meradang." },
            { q: "Tea Tree Oil dikenal memiliki sifat alami sebagai...", opt: ["Pelembap khusus kulit terkelupas", "Antimikroba penumpas bakteri jerawat"], a: 1, exp: "Tea Tree Oil memiliki zat antibakteri kuat untuk melawan bakteri penyebab jerawat." },
            { q: "Bahan pelembap kelompok humektan klasik penjaga kelembutan kulit adalah...", opt: ["Glycerin", "Paraffin Wax"], a: 0, exp: "Glycerin adalah humektan aman yang menjaga kadar air tetap stabil di dalam kulit." },
            { q: "Panthenol dikenal juga sebagai...", opt: ["Vitamin A pemicu regenerasi", "Pro-Vitamin B5 untuk hidrasi mendalam"], a: 1, exp: "Panthenol atau Pro-Vitamin B5 memperbaiki kelembapan sekaligus menenangkan iritasi." },
            { q: "Kandungan pencerah alami dari ekstrak tumbuhan yang aman untuk kulit sensitif adalah...", opt: ["Licorice Root Extract", "Bleaching Agent"], a: 0, exp: "Licorice root mencerahkan kulit secara lembut tanpa memicu iritasi pada kulit sensitif." }
        ]
    },
    3: {
        title: "Level 3: Medium (Layering & Cara Pakai)",
        time: 10, lives: 5, selectCount: 10, type: "single",
        questions: [
            { q: "Bahan aktif mana yang NGGAK BOLEH dipakai bersamaan dengan Retinol dalam 1 jadwal?", opt: ["B. Hyaluronic Acid & Ceramide", "A. AHA / BHA (Eksfoliasi)"], a: 1, exp: "Menggabungkan Retinol dan eksfoliator kimiawi dalam satu waktu memicu iritasi dan over-exfoliation." },
            { q: "Urutan skincare pagi hari yang benar setelah cuci muka adalah...", opt: ["A. Toner ➔ Serum ➔ Moisturizer ➔ Sunscreen", "B. Sunscreen ➔ Moisturizer ➔ Serum ➔ Toner"], a: 0, exp: "Skincare diaplikasikan dari tekstur paling cair ke paling kental, ditutup sunscreen di urutan akhir." },
            { q: "Boleh tidak mencampur Vitamin C dosis tinggi bersamaan dengan AHA/BHA?", opt: ["B. Boleh banget dicampur setiap pagi", "A. Tidak boleh, berisiko iritasi parah"], a: 1, exp: "Keduanya bersifat asam kuat yang jika ditumpuk dapat merusak lapisan pelindung kulit." },
            { q: "Bahan penenang apa yang sangat cocok digabung dengan Salicylic Acid?", opt: ["A. Centella Asiatica / Panthenol", "B. Retinol 1% High Dose"], a: 0, exp: "Salicylic Acid bisa mengeringkan, sehingga butuh Centella/Panthenol untuk menenangkan kulit." },
            { q: "Urutan pemakaian produk skincare berdasarkan tekstur yang benar adalah...", opt: ["B. Dari paling kental ke paling encer", "A. Dari paling encer ke paling kental"], a: 1, exp: "Produk bertekstur encer harus meresap dulu sebelum produk yang lebih pekat diaplikasikan." },
            { q: "Berapa kali idealnya melakukan eksfoliasi kimiawi (AHA/BHA) dalam seminggu?", opt: ["A. 2 - 3 Kali seminggu", "B. 7 Kali seminggu tiap pagi dan malam"], a: 0, exp: "Frekuensi 2-3 kali seminggu sudah cukup untuk mengangkat sel kulit mati tanpa menipiskan kulit." },
            { q: "Setelah memakai Retinol di malam hari, wajib hukumnya memakai apa di pagi harinya?", opt: ["B. Scrub kasar wajah", "A. Sunscreen"], a: 1, exp: "Kulit baru setelah terpapar retinol sangat rentan terhadap sinar UV, sehingga wajib memakai sunscreen." },
            { q: "Bahan apa yang paling aman digabung dengan Niacinamide untuk melembabkan?", opt: ["A. Hyaluronic Acid / Ceramide", "B. High Dose Exfoliator"], a: 0, exp: "Niacinamide sangat ramah dipasangkan dengan humektan dan ceramide untuk memperkuat hidrasi." },
            { q: "Kapan waktu terbaik untuk mengaplikasikan produk Exfoliating Toner?", opt: ["B. Siang hari sebelum berjemur", "A. Malam hari"], a: 1, exp: "Eksfoliator membuat kulit sensitif terhadap matahari, jadi wajib dipakai pada malam hari." },
            { q: "Apa yang terjadi jika tidak re-apply sunscreen saat beraktivitas seharian di luar?", opt: ["A. Perlindungan UV meredup & kulit kusam", "B. Muka otomatis berjerawat parah"], a: 0, exp: "UV filter pada sunscreen meluruh karena keringat, membuat kulit kembali terpapar sinar matahari." },
            { q: "Kapan waktu yang tepat mengaplikasikan Moisturizer?", opt: ["A. Pagi dan Malam hari", "B. Seminggu sekali saja"], a: 0, exp: "Moisturizer wajib dipakai rutin dua kali sehari untuk mengunci kelembapan." },
            { q: "Pemakaian sheetmask sebaiknya dilakukan selama...", opt: ["B. Semalaman sampai kering menempel", "A. 15 - 20 Menit saja"], a: 1, exp: "Memakai sheetmask terlalu lama hingga kering justru menyedot kembali kelembapan dari wajah." },
            { q: "Jika menggunakan serum Vitamin C di pagi hari, produk apa yang wajib mendampinginya?", opt: ["A. Sunscreen", "B. Night Cream"], a: 0, exp: "Vitamin C dan sunscreen bekerja sinergis sebagai perisai ganda penangkal radikal bebas UV." },
            { q: "Teknik double cleansing paling penting dilakukan pada saat...", opt: ["B. Bangun tidur di pagi hari", "A. Malam hari setelah beraktivitas"], a: 1, exp: "Malam hari adalah waktu krusial membersihkan tumpukan kotoran, sebum, dan sisa sunscreen." },
            { q: "Pemakaian spot treatment jerawat dilakukan pada urutan...", opt: ["A. Paling akhir setelah moisturizer meresap", "B. Sebelum mencuci muka"], a: 0, exp: "Spot treatment dioleskan di tahap akhir agar obat jerawat bekerja terpusat di area bermasalah." }
        ]
    },
    4: {
        title: "Level 4: Hard (Multiple Selection - Teliti!)",
        time: 15, lives: 5, selectCount: 5, type: "multi",
        questions: [
            { 
                q: "Manakah dari bahan berikut yang berfungsi ganda untuk merawat kulit BERJERAWAT sekaligus BERMINYAK?", 
                opt: ["Salicylic Acid (BHA)", "Petroleum Jelly", "Zinc PCA", "Olive Oil"], 
                correctIndices: [0, 2],
                exp: "Salicylic Acid membersihkan pori tersumbat dan Zinc PCA mengontrol sebum berlebih."
            },
            { 
                q: "Bahan manakah yang termasuk dalam kategori eksfoliator kimiawi (AHA/BHA)?", 
                opt: ["Glycolic Acid", "Ceramide", "Salicylic Acid", "Lactic Acid"], 
                correctIndices: [0, 2, 3],
                exp: "Glycolic Acid & Lactic Acid adalah jenis AHA, sedangkan Salicylic Acid adalah BHA."
            },
            { 
                q: "Pilih bahan aktif yang paling ampuh dan aman untuk memudarkan BEKAS JERAWAT kehitaman!", 
                opt: ["Alpha Arbutin", "Niacinamide", "Sulfur murni", "Tranexamic Acid"], 
                correctIndices: [0, 1, 3],
                exp: "Alpha Arbutin, Niacinamide, dan Tranexamic Acid terbukti klinis mencerahkan hiperpigmentasi."
            },
            { 
                q: "Bahan penenang manakah yang disarankan untuk memperbaiki SKIN BARRIER rusak?", 
                opt: ["Ceramide", "Physical Scrub", "Centella Asiatica", "Panthenol"], 
                correctIndices: [0, 2, 3],
                exp: "Ceramide, Centella, dan Panthenol adalah trio penyelamat untuk memperbaiki skin barrier."
            },
            { 
                q: "Manakah produk yang WAJIB hukumnya ada dalam rutinitas Basic Skincare pagi hari?", 
                opt: ["Moisturizer", "Retinol Serum", "Sunscreen", "Facewash gentle"], 
                correctIndices: [0, 2, 3],
                exp: "Basic skincare wajib terdiri dari pembersih lembut, pelembap, dan perlindungan sunscreen."
            },
            { 
                q: "Pilih bahan pelembap yang termasuk dalam kelompok Humektan penarik air!", 
                opt: ["Hyaluronic Acid", "Mineral Oil", "Glycerin", "Beeswax"], 
                correctIndices: [0, 2],
                exp: "Hyaluronic Acid dan Glycerin bekerja menarik molekul air dari udara ke dalam kulit."
            },
            { 
                q: "Bahan mana saja yang NGGAK DISARANKAN digabung bersamaan dengan Retinol?", 
                opt: ["AHA (Glycolic Acid)", "Ceramide", "BHA (Salicylic Acid)", "High Dose Vitamin C"], 
                correctIndices: [0, 2, 3],
                exp: "Eksfoliator asam dan Vitamin C dosis tinggi memicu iritasi jika ditumpuk bersama Retinol."
            },
            { 
                q: "Apa saja tanda-tanda jika kulit kamu mengalami Over-Exfoliation?", 
                opt: ["Pori-pori mendadak hilang", "Kulit terasa perih dan kemerahan", "Kulit makin kenyal dan lembap", "Skin barrier terasa menipis & sensitif"], 
                correctIndices: [1, 3],
                exp: "Kulit perih, merah, dan sangat sensitif adalah ciri utama skin barrier rusak akibat over-exfoliation."
            },
            { 
                q: "Manakah bahan pencerah yang aman diandalkan untuk mengatasi kulit kusam?", 
                opt: ["Vitamin C", "Alcohol", "Tranexamic Acid", "Niacinamide"], 
                correctIndices: [0, 2, 3],
                exp: "Vitamin C, Tranexamic Acid, dan Niacinamide sangat efektif menghempas kulit kusam."
            },
            { 
                q: "Pilih fungsi utama dari penggunaan Sunscreen di pagi hari?", 
                opt: ["Mencegah penuaan dini & flek hitam", "Mengubah kulit jadi putih permanen", "Melindungi kulit dari radiasi UV", "Mencegah kanker kulit"], 
                correctIndices: [0, 2, 3],
                exp: "Sunscreen berfungsi melindungi dari radiasi UV, mencegah flek, penuaan dini, dan kanker kulit."
            }
        ]
    },
    5: {
        title: "Level 5: Extreme (Chaotic Case Study)",
        time: 30, lives: 5, selectCount: 5, type: "single",
        questions: [
            {
                q: "Aiman bercerita bahwa kulit wajahnya yang berminyak tiba-tiba jadi sangat kering, perih, dan muncul banyak jerawat kecil setelah rutin memakai exfoliating toner 5 kali seminggu. Aiman bingung dan minta saran lengkap apa yang harus dia lakukan.",
                opt: [
                    "A. Gunakan moisturizer Ceramide untuk perbaiki skin barrier, tapi tetap lanjutkan eksfoliasi 5 kali seminggu agar jerawatnya cepat hilang.",
                    "B. Hentikan eksfoliasi sementara waktu, kembali ke basic skincare, gunakan moisturizer Ceramide/Centella untuk perbaiki skin barrier, lalu kurangi eksfoliasi jadi 1-2x seminggu jika pulih.",
                    "C. Hentikan eksfoliasi sementara waktu dan kurangi frekuensinya menjadi 1-2 kali seminggu saja jika kulit sudah membaik.",
                    "D. Sarankan untuk langsung menambah serum Retinol dosis tinggi di malam hari dan mencuci muka 4 kali sehari agar sel kulit mati cepat terangkat."
                ],
                a: 1,
                exp: "Aiman mengalami over-exfoliation. Solusi lengkap wajib menyetop eksfoliator, perbaiki skin barrier dengan Ceramide/Centella, baru nanti kurangi frekuensi eksfoliasinya."
            },
            {
                q: "Fida rutin memakai serum Retinol 1% tiap malam agar bekas jerawatnya hilang. Tapi Fida yang suka latihan ekstrakurikuler di lapangan pada siang hari tidak pernah memakai sunscreen karena merasa greasy. Sekarang wajah Fida muncul flek kehitaman & perih. Apa solusi terbaik?",
                opt: [
                    "A. Minta Fida untuk rutin memakai sunscreen setiap pagi saat latihan dan melakukan re-apply setiap 2-3 jam sekali.",
                    "B. Sarankan Fida memakai sunscreen cream kental di siang hari dan meningkatkan dosis Retinol jadi dipakai pagi dan malam hari.",
                    "C. Hentikan Retinol sementara, wajib pakai sunscreen matte/chemical tiap pagi (serta re-apply tiap 2-3 jam), dan setelah kulit pulih baru bisa pakai Retinol kembali 2-3x seminggu di malam hari.",
                    "D. Sarankan Fida mengoleskan minyak kelapa murni di siang hari sebelum latihan sebagai pengganti sunscreen alami."
                ],
                a: 2,
                exp: "Retinol bikin kulit foto-sensitif. Harus stop dulu Retinolnya, amankan dengan sunscreen matte non-greasy + re-apply, baru pakai Retinol lagi secara berkala."
            },
            {
                q: "Alam sedang bingung karena ibunya ingin merawat garis-garis halus di wajah tapi takut memakai Retinol karena khawatir kandungannya terlalu keras. Alam meminta rekomendasi bahan aktif alternatif yang aman untuk ibunya.",
                opt: [
                    "A. Tegaskan bahwa Retinol butuh adaptasi ketat, rekomendasikan serum Bakuchiol atau Peptide sebagai alternatif anti-aging nabati yang ramah di kulit, serta wajib dampingi dengan moisturizer & sunscreen.",
                    "B. Beritahu Alam bahwa ibunya langsung boleh pakai Retinol tanpa jeda setiap malam.",
                    "C. Sarankan Alam membelikan ibunya exfoliating scrub kasar agar garis halusnya cepat terangkat secara instan.",
                    "D. Sarankan Alam menyuruh ibunya memakai BHA konsentrasi 10% setiap hari agar garis halusnya cepat hilang."
                ],
                a: 0,
                exp: "Bakuchiol dan Peptide adalah solusi anti-aging terbaik & teraman yang ramah untuk kulit yang sensitif terhadap Retinol."
            },
            {
                q: "Naisila memiliki kulit yang sangat reaktif & sensitif. Tersisa noda hitam membandel (PIH) di pipinya. Naisila pernah mencoba serum Vitamin C 15% tapi wajahnya langsung gatal kemerahan. Naisila bingung harus pakai pencerah apa yang tidak bikin iritasi.",
                opt: [
                    "A. Sarankan Naisila memakai serum Niacinamide 10% dikombinasikan dengan scrub wajah kasar setiap hari agar bekas jerawat cepat mengelupas.",
                    "B. Sarankan Naisila untuk beralih menggunakan serum pencerah Niacinamide atau Alpha Arbutin saja.",
                    "C. Beritahu Naisila untuk memakai racikan krim pemutih tanpa BPOM yang dijual bebas karena reaksinya lebih cepat dibanding Vitamin C.",
                    "D. Beralih dari Vitamin C dosis tinggi ke pencerah gentle seperti Niacinamide dosis rendah (2-5%) atau Alpha Arbutin yang dikombinasikan dengan bahan soothing seperti Centella/Panthenol."
                ],
                a: 3,
                exp: "Kulit sensitif Naisila butuh pencerah gentle (Niacinamide 2-5% / Alpha Arbutin) + pendamping penenang (Centella/Panthenol)."
            },
            {
                q: "Gigih merasa mukanya kotor & lengket setelah naik motor sekolah. Gigih mencuci mukanya dengan facewash high-foam 5 kali sehari. Bukannya bersih, kulit Gigih malah makin berminyak parah di siang hari & beruntusan di dahi. Apa saran kamu untuk Gigih?",
                opt: [
                    "A. Beritahu Gigih untuk mengurangi frekuensi cuci muka menjadi 2 kali sehari saja dan gunakan Micellar Water di malam hari.",
                    "B. Edukasi Gigih bahwa cuci muka berlebihan memicu rebound oil. Cuci muka cukup 2x sehari (pagi & malam) dengan gentle cleanser, lakukan double cleansing dengan Micellar Water di malam hari, lalu pakai moisturizer gel.",
                    "C. Sarankan Gigih tetap cuci muka 5 kali sehari tapi ganti sabunnya dengan sabun batang untuk badan agar minyaknya benar-benar hilang.",
                    "D. Beritahu Gigih tidak usah cuci muka sama sekali selama seminggu penuh agar minyak alaminya kembali normal."
                ],
                a: 1,
                exp: "Gigih mengalami rebound oil akibat over-cleansing. Wajib turunkan frekuensi ke 2x sehari dengan gentle cleanser + double cleansing & moist gel."
            }
        ]
    }
};

// NAVIGASI UTAMA
function switchScreen(screenId) {
    stopBGM();
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'home-screen') renderHomeBadge();
    if (screenId === 'analisa-screen') initAnalisa();
    if (screenId === 'kamus-screen') initKamus();
    if (screenId === 'trivia-screen') initTrivia();
}

function renderHomeBadge() {
    const isBadgeUnlocked = localStorage.getItem('skincare_duta_badge');
    const existingBadge = document.getElementById('duta-badge-display');
    if (isBadgeUnlocked && !existingBadge) {
        const homeHeader = document.querySelector('#home-screen h1');
        if (homeHeader) {
            const badgeDiv = document.createElement('div');
            badgeDiv.id = 'duta-badge-display';
            badgeDiv.style.cssText = "background: linear-gradient(135deg, #FFD700, #FFA500); color: #fff; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: bold; margin: 0 auto 15px auto; display: block; width: fit-content; text-align: center; box-shadow: 0 2px 8px rgba(255,165,0,0.4); cursor: pointer;";
            badgeDiv.innerHTML = "🏆 DUTA SKINCARE";
            badgeDiv.onclick = () => {
                alert("Kamu mendapat badge ini karena telah menyelesaikan semua level pada Trivia Skincare");
            };
            homeHeader.before(badgeDiv);
        }
    }
}

// ==========================================
// FITUR 1: ANALISA KULIT
// ==========================================
let analisaData = { nama: '', skinType: '', problems: [] };

function initAnalisa() { renderAnalisaStep(1); }

function renderAnalisaStep(step) {
    const container = document.getElementById('analisa-container');
    if (step === 1) {
        container.innerHTML = `
            <h3>Langkah 1: Data Diri</h3>
            <p style="font-size: 13px;">Masukkan nama kamu sebelum memulai analisa:</p>
            <input type="text" id="user-name" class="form-input" placeholder="Ketik nama kamu di sini..." value="${analisaData.nama}">
            <button class="menu-btn" onclick="saveName()">Lanjut ➡</button>
        `;
    } else if (step === 2) {
        container.innerHTML = `
            <h3>Langkah 2: Tipe Kulit</h3>
            <p style="font-size: 13px;">Halo <strong>${analisaData.nama}</strong>, pilih tipe kulit kamu:</p>
            <div class="menu-container">
                <button class="menu-btn" onclick="saveSkinType('Kering')">Kering</button>
                <button class="menu-btn" onclick="saveSkinType('Berminyak')">Berminyak</button>
                <button class="menu-btn" onclick="saveSkinType('Kombinasi')">Kombinasi</button>
            </div>
        `;
    } else if (step === 3) {
        container.innerHTML = `
            <h3>Langkah 3: Permasalahan Kulit</h3>
            <div class="quiz-checkbox-grid">
                <label><input type="checkbox" value="Jerawat"> Jerawat Aktif</label>
                <label><input type="checkbox" value="Beruntusan"> Beruntusan</label>
                <label><input type="checkbox" value="Bekas Jerawat"> Bekas Jerawat</label>
                <label><input type="checkbox" value="Kusam"> Kulit Kusam</label>
                <label><input type="checkbox" value="Skin Barrier"> Skin Barrier Rusak</label>
            </div>
            <button class="menu-btn" onclick="saveProblems()">Lanjut ➡</button>
        `;
    } else if (step === 4) {
        showAnalisaResult();
    }
}

function saveName() {
    const val = document.getElementById('user-name').value.trim();
    if (!val) return alert("Silakan isi nama kamu dulu ya!");
    analisaData.nama = val;
    renderAnalisaStep(2);
}

function saveSkinType(type) { analisaData.skinType = type; renderAnalisaStep(3); }

function saveProblems() {
    const checkboxes = document.querySelectorAll('#analisa-container input[type="checkbox"]:checked');
    analisaData.problems = Array.from(checkboxes).map(cb => cb.value);
    renderAnalisaStep(4);
}

function showAnalisaResult() {
    const container = document.getElementById('analisa-container');
    const isOily = analisaData.skinType === 'Berminyak';
    
    const routine = [
        { type: "🧼 Facewash", item: isOily ? skincareDatabase["Facewash"][1] : skincareDatabase["Facewash"][0] },
        { type: "💧 Toner", item: isOily ? skincareDatabase["Toner"][2] : skincareDatabase["Toner"][0] },
        { type: "✨ Serum", item: isOily ? skincareDatabase["Serum"][1] : skincareDatabase["Serum"][0] },
        { type: "🧴 Moisturizer", item: skincareDatabase["Moisturizer"][0] },
        { type: "☀️ Sunscreen", item: isOily ? skincareDatabase["Sunscreen"][1] : skincareDatabase["Sunscreen"][0] }
    ];

    let cardsHTML = routine.map(prod => `
        <div style="background: #FFF0F3; border: 1px solid #F8BBD0; border-radius: 12px; padding: 10px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <img src="${prod.item.img}" style="width: 65px; height: 90px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" onerror="this.src='https://via.placeholder.com/65x90?text=No+Img'">
            <div style="text-align: left; flex-grow: 1;">
                <span style="font-size: 11px; background: #D81B60; color: white; padding: 2px 8px; border-radius: 10px; font-weight: bold;">${prod.type}</span>
                <h4 style="margin: 5px 0 2px 0; color: #D81B60; font-size: 14px;">${prod.item.nama}</h4>
                <p style="margin: 0; font-size: 12px; color: #555;"><strong>Harga:</strong> ${prod.item.harga} (${prod.item.ukuran})</p>
                <p style="margin: 2px 0; font-size: 11px; color: #D81B60;"><strong>Kandungan Utama:</strong> ${prod.item.ingredients}</p>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #777; font-style: italic;">"${prod.item.review}"</p>
            </div>
        </div>
    `).join('');

    // Format pesan WhatsApp untuk Analisa (Nomor: 6285640743667)
    const waText = encodeURIComponent(
        `✨ *HASIL ANALISA KULIT & REKOMENDASI* ✨\n\n` +
        `👤 Nama: ${analisaData.nama}\n` +
        `💧 Tipe Kulit: ${analisaData.skinType}\n` +
        `⚠️ Masalah: ${analisaData.problems.join(', ') || 'Tidak ada'}\n\n` +
        `📋 *Rekomendasi Skincare Routine:*\n` +
        routine.map(r => `• ${r.type}: ${r.item.nama} (${r.item.harga})`).join('\n')
    );
    const waLink = `https://api.whatsapp.com/send?phone=6285640743667&text=${waText}`;

    container.innerHTML = `
        <h3 style="color: #D81B60;">Hasil Analisa Kulit ${analisaData.nama} 🎉</h3>
        <p style="font-size: 13px; margin-bottom: 15px;">Berikut 1 Paket Skincare Routine Lengkap yang diracik khusus untuk kondisi kulit <strong>${analisaData.skinType}</strong> kamu:</p>
        <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">${cardsHTML}</div>
        <a href="${waLink}" target="_blank" style="text-decoration:none;">
            <button class="menu-btn" style="background:#25D366; margin-top:12px;">📲 Kirim Hasil ke WhatsApp 💬</button>
        </a>
        <button class="menu-btn" style="margin-top: 8px; background: #888;" onclick="switchScreen('home-screen')">Selesai & Kembali</button>
    `;
}

// ==========================================
// FITUR 2: KAMUS INGREDIENTS
// ==========================================
function initKamus() {
    const btnBox = document.getElementById('kamus-problem-buttons');
    btnBox.innerHTML = '';
    
    Object.keys(kamusData).forEach(prob => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerText = prob;
        btn.id = 'btn-' + prob.replace(/\s+/g, '-');
        btn.onclick = () => showIngredients(prob);
        btnBox.appendChild(btn);
    });
    
    const listContainer = document.getElementById('ingredients-list');
    listContainer.innerHTML = `<p style="grid-column: span 2; text-align: center; color: #888; font-style: italic; margin-top: 30px;">👆 Silakan pilih salah satu kategori di atas untuk melihat daftar ingredients.</p>`;
}

function showIngredients(problemKey) {
    document.querySelectorAll('.category-btn').forEach(b => {
        b.style.fontWeight = 'normal';
        b.style.border = 'none';
        b.style.boxShadow = 'none';
    });
    
    const activeBtn = document.getElementById('btn-' + problemKey.replace(/\s+/g, '-'));
    if (activeBtn) {
        activeBtn.style.fontWeight = 'bold';
        activeBtn.style.border = '2px solid #D81B60';
        activeBtn.style.boxShadow = '0 2px 8px rgba(216,27,96,0.3)';
    }

    const listContainer = document.getElementById('ingredients-list');
    listContainer.innerHTML = '';
    
    kamusData[problemKey].forEach(item => {
        const card = document.createElement('div');
        card.className = 'ing-card';
        card.innerText = item.nama;
        card.onclick = () => openIngModal(item);
        listContainer.appendChild(card);
    });
}

function openIngModal(item) {
    const details = document.getElementById('modal-details');
    details.innerHTML = `
        <h3 style="color: #D81B60;">${item.nama}</h3>
        <p><strong>Fungsi Utama:</strong> ${item.fungsi}</p>
        <p><strong>Spesifikasi / Persentase Aman:</strong> ${item.takaran}</p>
        <p><strong>Format Produk Terbaik:</strong> ${item.cocokDi}</p>
    `;
    document.getElementById('app-modal').style.display = 'block';
}

// ==========================================
// FITUR 3: TRIVIA GAME ENGINE (PRO SYSTEM)
// ==========================================
let triviaState = {
    playerName: '',
    level: 1,
    lives: 3,
    currentIndex: 0,
    timer: null,
    timeLeft: 5,
    questions: [],
    isFreeMode: false,
    selectedLevelFree: 1
};

function initTrivia() {
    stopBGM();
    const isBadgeUnlocked = localStorage.getItem('skincare_duta_badge');
    const container = document.getElementById('trivia-container');
    
    // Format pesan WhatsApp untuk progres Trivia (Nomor: 6285640743667)
    const waTriviaText = encodeURIComponent(
        `🎮 *STATUS TRIVIA SKINCARE* 🎮\n\n` +
        `👤 Pemain: ${triviaState.playerName || 'Belum input'}\n` +
        `⭐ Level Saat Ini: Level ${triviaState.level}\n` +
        `🏆 Status Badge Duta Skincare: ${isUnlockedText(isBadgeUnlocked)}`
    );
    const waTriviaLink = `https://api.whatsapp.com/send?phone=6285640743667&text=${waTriviaText}`;

    if (isBadgeUnlocked) {
        container.innerHTML = `
            <div class="trivia-box" style="text-align: center;">
                <span style="font-size:12px; background:#FFD700; color:#fff; padding:3px 10px; border-radius:10px; font-weight:bold;">🏆 DUTA SKINCARE UNLOCKED</span>
                <h3 style="margin-top:10px;">Pilih Level Latihan Bebas</h3>
                <p style="font-size: 12px; color: #666;">Tanpa Batasan Waktu & Nyawa! Lengkap dengan Pembahasan Jawaban di Setiap Soal.</p>
                <div class="menu-container" style="gap:8px; margin-top:15px;">
                    <button class="menu-btn" onclick="startFreeMode(1)">Level 1 (Pemula B/S)</button>
                    <button class="menu-btn" onclick="startFreeMode(2)">Level 2 (Fungsi Ingredients)</button>
                    <button class="menu-btn" onclick="startFreeMode(3)">Level 3 (Layering Skincare)</button>
                    <button class="menu-btn" onclick="startFreeMode(4)">Level 4 (Multiple Choice Hard)</button>
                    <button class="menu-btn" onclick="startFreeMode(5)">Level 5 (Extreme Case Study)</button>
                </div>
                <a href="${waTriviaLink}" target="_blank" style="text-decoration:none;">
                    <button class="menu-btn" style="background:#25D366; margin-top:15px; width:100%;">📲 Kirim Progress Kuis ke WhatsApp 💬</button>
                </a>
            </div>
        `;
    } else {
        const savedLvl = localStorage.getItem('skincare_trivia_checkpoint') || 1;
        triviaState.level = parseInt(savedLvl);
        
        container.innerHTML = `
            <div class="trivia-box" style="text-align: center;">
                <h3>🎮 Trivia Skincare</h3>
                <p style="font-size: 13px; color: #D81B60; font-weight: bold; margin: 10px 0;">Yakin udah jago di dunia skincare? Yuk coba jawab beberapa kuis ini!</p>
                <p style="font-size: 13px; color: #666; margin-bottom: 15px;">Masukkan nama kamu untuk memulai tantangan Trivia:</p>
                <input type="text" id="trivia-player-name" class="form-input" placeholder="Ketik nama kamu..." value="${triviaState.playerName}">
                <button class="menu-btn" onclick="confirmTriviaPlayer()">Lanjut ➡</button>
            </div>
        `;
    }
}

function isUnlockedText(val) {
    return val ? "SUDAH DITAMATKAN 🎖️" : "BELUM SELESAI ⏳";
}

function confirmTriviaPlayer() {
    const val = document.getElementById('trivia-player-name').value.trim();
    if (!val) return alert("Isi nama kamu dulu ya!");
    triviaState.playerName = val;
    triviaState.isFreeMode = false;
    showLevelStartScreen();
}

function showLevelStartScreen() {
    const container = document.getElementById('trivia-container');
    const lvlInfo = triviaLevels[triviaState.level];
    
    container.innerHTML = `
        <div class="trivia-box" style="text-align: center;">
            <h3>🎮 Trivia Skincare</h3>
            <h4 style="color: #D81B60; margin: 5px 0;">${lvlInfo.title}</h4>
            <p style="font-size: 13px; margin: 15px 0;">Pemain: <strong>${triviaState.playerName}</strong></p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Soal: ${lvlInfo.selectCount} | Nyawa: ${'❤️'.repeat(lvlInfo.lives)} | Waktu: ${lvlInfo.time}s per soal</p>
            <button class="menu-btn" onclick="startCountdownAnimation()">Mulai Tantangan!</button>
        </div>
    `;
}

function startCountdownAnimation() {
    const container = document.getElementById('trivia-container');
    let count = 3;
    
    playSFX('countdown');
    container.innerHTML = `<div class="trivia-box" style="text-align:center;"><h1 style="font-size:70px; color:#D81B60; margin:30px 0;">${count}</h1></div>`;
    
    const cdTimer = setInterval(() => {
        count--;
        if (count > 0) {
            playSFX('countdown');
            container.innerHTML = `<div class="trivia-box" style="text-align:center;"><h1 style="font-size:70px; color:#D81B60; margin:30px 0;">${count}</h1></div>`;
        } else {
            clearInterval(cdTimer);
            playSFX('start');
            container.innerHTML = `<div class="trivia-box" style="text-align:center;"><h1 style="font-size:60px; color:#81C784; margin:30px 0;">GO! 🔥</h1></div>`;
            setTimeout(() => {
                startTriviaGameEngine();
            }, 600);
        }
    }, 1000);
}

function startTriviaGameEngine() {
    bgmAudio.play().catch(e => console.log("BGM play prevented"));
    
    const lvlInfo = triviaLevels[triviaState.level];
    
    if (triviaState.level === 5) {
        triviaState.questions = [...lvlInfo.questions];
    } else {
        triviaState.questions = [...lvlInfo.questions].sort(() => Math.random() - 0.5).slice(0, lvlInfo.selectCount);
    }
    
    triviaState.lives = lvlInfo.lives;
    triviaState.currentIndex = 0;
    renderQuestionCard();
}

function renderQuestionCard() {
    clearInterval(triviaState.timer);
    
    if (!triviaState.isFreeMode && triviaState.lives <= 0) {
        return showGameOverScreen();
    }
    if (triviaState.currentIndex >= triviaState.questions.length) {
        return triviaState.isFreeMode ? showFreeModeComplete() : showLevelClearScreen();
    }

    const lvlInfo = triviaLevels[triviaState.isFreeMode ? triviaState.selectedLevelFree : triviaState.level];
    triviaState.timeLeft = lvlInfo.time;
    const q = triviaState.questions[triviaState.currentIndex];
    const container = document.getElementById('trivia-container');

    let inputControlsHTML = '';
    
    if (lvlInfo.type === 'tf') {
        inputControlsHTML = `
            <div class="trivia-btn-container" style="margin-top:15px;">
                <button class="trivia-btn-true" onclick="submitAnswer(true)">BENAR</button>
                <button class="trivia-btn-false" onclick="submitAnswer(false)">SALAH</button>
            </div>
        `;
    } else if (lvlInfo.type === 'single') {
        inputControlsHTML = `<div class="menu-container" style="margin-top:15px; gap:8px;">` + 
            q.opt.map((o, idx) => `<button class="menu-btn" style="font-size:12px; text-align:left; padding:12px;" onclick="submitAnswer(${idx})">${o}</button>`).join('') + 
            `</div>`;
    } else if (lvlInfo.type === 'multi') {
        inputControlsHTML = `
            <div class="quiz-checkbox-grid" style="margin-top:15px; text-align:left;">
                ${q.opt.map((o, idx) => `<label style="font-size:12px;"><input type="checkbox" class="multi-opt" value="${idx}"> ${o}</label>`).join('')}
            </div>
            <button class="menu-btn" style="margin-top:10px;" onclick="submitMultiAnswer()">Jawab & Lanjut ➡</button>
        `;
    }

    const timerBadgeHTML = triviaState.isFreeMode ? '' : `<div class="timer-badge" id="timer-display" style="margin: 0 auto 10px auto;">⏱️ ${triviaState.timeLeft}s</div>`;
    const livesDisplayHTML = triviaState.isFreeMode ? '<span style="color:#81C784; font-weight:bold;">MODE BEBAS (TANPA NYAWA)</span>' : '❤️'.repeat(triviaState.lives);

    container.innerHTML = `
        <div class="trivia-box" style="text-align: center;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 3px; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: bold; color: #D81B60;">Level ${triviaState.isFreeMode ? triviaState.selectedLevelFree : triviaState.level} (${triviaState.currentIndex + 1}/${triviaState.questions.length})</span>
                <div class="lives-badge" style="margin: 0; font-size: 18px;">${livesDisplayHTML}</div>
            </div>
            ${timerBadgeHTML}
            <p style="font-size: 14px; font-weight: bold; margin: 10px 0; min-height: 45px; text-align: center;">"${q.q}"</p>
            <div id="action-box">${inputControlsHTML}</div>
            <div id="explanation-box" style="display:none; margin-top:12px; padding:10px; background:#FFF0F3; border-radius:10px; font-size:12px; text-align:left; color:#D81B60;"></div>
        </div>
    `;

    if (!triviaState.isFreeMode) {
        triviaState.timer = setInterval(() => {
            triviaState.timeLeft--;
            const tDisp = document.getElementById('timer-display');
            if (tDisp) tDisp.innerText = `⏱️ ${triviaState.timeLeft}s`;
            
            if (triviaState.timeLeft <= 0) {
                clearInterval(triviaState.timer);
                playSFX('wrong');
                triviaState.lives--;
                triviaState.currentIndex++;
                renderQuestionCard();
            }
        }, 1000);
    }
}

function submitAnswer(userAns) {
    if (!triviaState.isFreeMode) clearInterval(triviaState.timer);
    
    const q = triviaState.questions[triviaState.currentIndex];
    const isCorrect = userAns === q.a;
    
    if (triviaState.isFreeMode) {
        showFreeModeExplanation(isCorrect, q);
    } else {
        if (!isCorrect) {
            playSFX('wrong');
            triviaState.lives--;
        } else {
            playSFX('correct');
        }
        triviaState.currentIndex++;
        renderQuestionCard();
    }
}

function submitMultiAnswer() {
    if (!triviaState.isFreeMode) clearInterval(triviaState.timer);
    
    const checkboxes = document.querySelectorAll('.multi-opt:checked');
    const userSelected = Array.from(checkboxes).map(cb => parseInt(cb.value)).sort();
    const q = triviaState.questions[triviaState.currentIndex];
    const targetCorrect = [...q.correctIndices].sort();
    
    const isCorrect = JSON.stringify(userSelected) === JSON.stringify(targetCorrect);
    
    if (triviaState.isFreeMode) {
        showFreeModeExplanation(isCorrect, q);
    } else {
        if (!isCorrect) {
            playSFX('wrong');
            triviaState.lives--;
        } else {
            playSFX('correct');
        }
        triviaState.currentIndex++;
        renderQuestionCard();
    }
}

function showFreeModeExplanation(isCorrect, q) {
    if (isCorrect) playSFX('correct'); else playSFX('wrong');
    
    const actionBox = document.getElementById('action-box');
    const expBox = document.getElementById('explanation-box');
    
    let answerText = '';
    if (q.opt && typeof q.a === 'number') answerText = q.opt[q.a];
    else if (q.correctIndices) answerText = q.correctIndices.map(i => q.opt[i]).join(', ');
    else answerText = q.a ? 'BENAR' : 'SALAH';

    expBox.style.display = 'block';
    expBox.innerHTML = `
        <p style="margin:0 0 5px 0; font-weight:bold;">${isCorrect ? '✅ Jawaban Kamu Benar!' : '❌ Jawaban Kamu Kurang Tepat!'}</p>
        <p style="margin:0 0 5px 0;"><strong>Jawaban yang Benar:</strong> ${answerText}</p>
        ${q.exp ? `<p style="margin:0; font-style:italic;">💡 ${q.exp}</p>` : ''}
    `;

    actionBox.innerHTML = `<button class="menu-btn" style="margin-top:10px;" onclick="nextFreeQuestion()">Soal Selanjutnya ➡</button>`;
}

function nextFreeQuestion() {
    triviaState.currentIndex++;
    renderQuestionCard();
}

function showLevelClearScreen() {
    stopBGM();
    playSFX('levelUp');
    
    const container = document.getElementById('trivia-container');
    
    if (triviaState.level < 5) {
        const nextLvl = triviaState.level + 1;
        localStorage.setItem('skincare_trivia_checkpoint', nextLvl);

        container.innerHTML = `
            <div class="trivia-box" style="text-align: center;">
                <h2 style="color: #81C784;">Lulus Level ${triviaState.level}! 🎉</h2>
                <p style="font-size: 13px;">Hebat banget <strong>${triviaState.playerName}</strong>! Progress tersimpan. Siap naik ke Level ${nextLvl}?</p>
                <button class="menu-btn" style="margin-top: 15px;" onclick="advanceNextLevel()">Lanjut Level ${nextLvl} 🚀</button>
            </div>
        `;
    } else {
        localStorage.setItem('skincare_duta_badge', 'true');
        localStorage.removeItem('skincare_trivia_checkpoint');

        // Format pesan WhatsApp saat menang kuis & dapat badge (Nomor: 6285640743667)
        const waWinText = encodeURIComponent(
            `🏆 *SELAMAT! BADGE DUTA SKINCARE DIDAPATKAN* 🏆\n\n` +
            `👤 Pemain: ${triviaState.playerName}\n` +
            `🎖️ Status: Berhasil menamatkan 5 Level Trivia Skincare!\n` +
            `✨ Siap menjadi Beauty Advisor profesional!`
        );
        const waWinLink = `https://api.whatsapp.com/send?phone=6285640743667&text=${waWinText}`;

        container.innerHTML = `
            <div class="trivia-box" style="text-align: center;">
                <h2 style="color: #D81B60;">SELAMAT ${triviaState.playerName.toUpperCase()}! 🏆✨</h2>
                <p style="font-size: 13px; font-weight:bold; color:#555; line-height: 1.5; margin: 12px 0;">Selamat kamu telah mendapatkan badge Duta Skincare karena telah menyelesaikan 5 level dari Trivia Skincare</p>
                <a href="${waWinLink}" target="_blank" style="text-decoration:none;">
                    <button class="menu-btn" style="background:#25D366; margin-top:5px; width:100%;">📲 Kirim Kemenangan ke WhatsApp 💬</button>
                </a>
                <button class="menu-btn" style="margin-top: 8px;" onclick="switchScreen('home-screen')">Ke Beranda & Klaim Badge 🎖️</button>
            </div>
        `;
    }
}

function advanceNextLevel() {
    triviaState.level++;
    showLevelStartScreen();
}

function showGameOverScreen() {
    stopBGM();
    playSFX('gameOver');
    
    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="text-align: center;">
            <h2 style="color: #E57373;">Game Over! 💔</h2>
            <p style="font-size: 13px;">Kehabisan nyawa di Level ${triviaState.level}! Tenang, checkpoint kamu aman di <strong>Level ${triviaState.level}</strong>.</p>
            <button class="menu-btn" style="margin-top: 15px;" onclick="showLevelStartScreen()">Ulangi Level ${triviaState.level} 🔄</button>
        </div>
    `;
}

// FREE MODE CONTROLLER
function startFreeMode(lvlNum) {
    initAudio();
    bgmAudio.play().catch(e => console.log(e));
    
    triviaState.isFreeMode = true;
    triviaState.selectedLevelFree = lvlNum;
    triviaState.currentIndex = 0;
    
    const lvlInfo = triviaLevels[lvlNum];
    triviaState.questions = [...lvlInfo.questions];
    
    renderQuestionCard();
}

function showFreeModeComplete() {
    stopBGM();
    playSFX('levelUp');
    
    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="text-align: center;">
            <h2 style="color: #81C784;">Latihan Selesai! 👏</h2>
            <p style="font-size: 13px;">Kamu telah menyelesaikan seluruh pertanyaan di Level ${triviaState.selectedLevelFree}.</p>
            <button class="menu-btn" style="margin-top: 15px;" onclick="initTrivia()">Pilih Level Lain 🔄</button>
        </div>
    `;
}

// MODAL CONTROLLER
function closeModal() { document.getElementById('app-modal').style.display = 'none'; }
window.onclick = function(event) {
    const modal = document.getElementById('app-modal');
    if (event.target == modal) modal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    renderHomeBadge();
});