// Database Lengkap Review Skincare Kamu
const skincareDatabase = {
    "Facewash": [
        { img: "facewash1.jpg", nama: "Facewash Hanasui Pink", ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid + MULTIVITAMIN", harga: "25rb", ukuran: "60ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Cream", review: "Disclaimer sebenernya gada facewash yang bisa bikin cerah, paling cerahnya tuh instan after bilas bukan efek yang permanen. Tapi untuk daya bersihin nya cukup oke dan gabikin kering after bilas." },
        { img: "facewash2.jpg", nama: "Facewash Hanasui Hijau", ingredients: "Nano Salicylic Acid, Centella Asiatica, Panthenol + MULTIVITAMIN", harga: "25rb", ukuran: "60ml", cocok: "Kombinasi, Beruntusan dan Berjerawat", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Cream", review: "Ampuh banget sumpah buat jerawat dan gabikin kering juga after bilas." },
        { img: "facewash3.jpg", nama: "Facewash Hadalabo Putih Gokujyun", ingredients: "2 Tipe Hyaluronic Acid", harga: "42rb", ukuran: "100ml", cocok: "Sangat Kering", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Cream", review: "Andalan buat kulit super kering nih, karena after bilas bikin lembut banget tapi sayang ini comedogenic." },
        { img: "facewash4.jpg", nama: "Facewash Hadalabo Biru Shirojyun", ingredients: "2 Tipe Hyaluronic Acid, Alpha Arbutin dan Vitamin C", harga: "42rb", ukuran: "100ml", cocok: "Sangat kering, Bekas Jerawat dan Kusam", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Cream", review: "Kulit lembut banget after dibilas, cocok buat kulit super kering. Uniknya facewash ini punya efek Instant Bright after dibilas (bukan permanen), sayangnya ini comedogenic." },
        { img: "facewash5.jpg", nama: "Facewash Y.O.U Hijau", ingredients: "1,5% Salicylic Acid dan Amino Acid", harga: "36rb", ukuran: "100ml", cocok: "Sangat Berminyak, Berjerawat, Beruntusan, Kemerahan dan Pori Pori", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Gel", review: "Cocok banget buat kalian yang kulitnya berminyak dan Acne Prone Skin karena ini ampuh banget." },
        { img: "facewash6.jpg", nama: "Facewash Glamazing Hijau", ingredients: "1% Salicylic Acid dan Panthenol", harga: "36rb", ukuran: "100ml", cocok: "Sangat berminyak, berjerawat, beruntusan, Sensitif, Kemerahan dan Pori Pori", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Gel", review: "Senjata buat para kulit sensitif, super oily dan Acne prone Skin. Pas dipake juga lembut gabikin iritasi." },
        { img: "facewash7.jpg", nama: "Facewash Glad2Glow Hijau", ingredients: "Salicylic Acid dan Centella", harga: "36rb", ukuran: "70ml", cocok: "Berminyak, Beruntusan dan Berjerawat", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Gel", review: "Ga ngaruh dan malah bikin kering after bilas." },
        { img: "facewash8.jpg", nama: "Facewash Barber Daily Acne", ingredients: "0,5% Salicylic Acid, Niacinamide dan Allantoin", harga: "38rb", ukuran: "100ml", cocok: "Berminyak, Kusam, Berjerawat, Beruntusan dan Kemerahan", waktu: "Pagi dan Malam", urutan: "micellar water/cleansing oil → FACE WASH → toner → serum → moisturizer (stop jika malam) → sunscreen (saat pagi)", tekstur: "Gel", review: "Lembut pas dipake dan gabikin kering after bilas, lumayan juga buat jerawat dan baunya enak walau menyengat." }
    ],
    "Toner": [
        { img: "toner1.jpg", nama: "Toner Hanasui Pink", ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid, 8 Hyaluronate + MULTIVITAMIN", harga: "30rb", ukuran: "105ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", waktu: "Pagi dan Malam", urutan: "micellar water → facewash → TONER → serum → moist → sunscreen", tekstur: "Watery", review: "Biasa aja, butuh beberapa bulan dan beberapa botol buat liat hasilnya." },
        { img: "toner2.jpg", nama: "Toner Autumn Ungu", ingredients: "5% Niacinamide, Vitamin C, Alpha Arbutin, Tranexamic Acid & 7x Hyaluronic", harga: "50rb", ukuran: "500ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", waktu: "Pagi dan Malam", urutan: "micellar water → facewash → TONER → serum → moist → sunscreen", tekstur: "Watery", review: "Buset ampuh banget buat kulit kusam dan bekas jerawat, ingredient brightening lengkap!" },
        { img: "toner3.jpg", nama: "Toner Autumn Hijau", ingredients: "Salicylic Acid dan Centella Asiatica", harga: "60rb", ukuran: "500ml", cocok: "Kombinasi, Pori Pori, Berjerawat dan Beruntusan", waktu: "Malam", urutan: "micellar water → facewash → TONER → serum → moist", tekstur: "Watery", review: "Lumayan kok buat jerawat dan beruntusan, harganya affordable." }
    ],
    "Serum": [
        { img: "serum1.jpg", nama: "Serum Hanasui Brightening", ingredients: "10% Advanced Niacinamide", harga: "30rb", ukuran: "20ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", waktu: "Pagi dan Malam", urutan: "toner → SERUM → moist → sunscreen", tekstur: "Agak Kental", review: "Kalau kalian sabar mau nunggu beberapa botol habis, kalian pasti liat hasilnya." },
        { img: "serum2.jpg", nama: "Serum Hanasui Acne", ingredients: "0,5% Salicylic Acid, Centella & Niacinamide", harga: "25rb", ukuran: "20ml", cocok: "Berminyak, Kusam, Berjerawat, Beruntusan dan Pori Pori", waktu: "Malam", urutan: "toner → SERUM → moist", tekstur: "Agak Kental", review: "Lumayan ngefek di jerawat, tapi bikin kering dan wanginya nyengat." },
        { img: "serum3.jpg", nama: "Serum Hanasui Bakuchiol", ingredients: "Bakuchiol", harga: "30rb", ukuran: "20ml", cocok: "Sangat Kering dan Anti Aging", waktu: "Pagi dan Malam", urutan: "toner → SERUM → moist → sunscreen", tekstur: "Kental", review: "Alternatif dari Retinol buat bumil busui, melembabkan banget." },
        { img: "serum4.jpg", nama: "Serum Hanasui MiniPore", ingredients: "NanoActive Salicylic Acid & Japan Panadoxine", harga: "30rb", ukuran: "20ml", cocok: "Berminyak dan pori pori", waktu: "Malam", urutan: "toner → SERUM → moist", tekstur: "Agak Kental", review: "Gada skincare buat kecilin pori permanen, ini kurang ngaruh." },
        { img: "serum5.jpg", nama: "Serum Somethinc Pink", ingredients: "2% Salicylic Acid", harga: "120rb", ukuran: "20ml", cocok: "Sangat berminyak, Beruntusan, Berjerawat, Komedo dan Pori Pori", waktu: "Malam", urutan: "toner → SERUM → moist", tekstur: "Watery", review: "Bener bener ampuh buat Acne Prone Skin! Komedo ikut keangkat." },
        { img: "serum6.jpg", nama: "Serum Somethinc Propolis", ingredients: "60% Korean Propolis, Bee Venom & Manuka Honey", harga: "120rb", ukuran: "20ml", cocok: "Sangat Kering, Skin barrier rusak dan Anti aging", waktu: "Pagi dan Malam", urutan: "toner → SERUM → moist → sunscreen", tekstur: "Kental", review: "Melembabkan dan menghidrasi banget, mengurangi sebum." },
        { img: "serum7.jpg", nama: "Serum Skin1004 Brightening", ingredients: "Niacinamide dan Centella Asiatica", harga: "250rb", ukuran: "100ml", cocok: "Kombinasi, Kusam dan Bekas Jerawat", waktu: "Pagi dan Malam", urutan: "toner → SERUM → moist → sunscreen", tekstur: "Agak Kental", review: "Butuh waktu buat liat hasilnya, makanya harus rutin pake." }
    ],
    "Moisturizer": [
        { img: "moist1.jpg", nama: "Moisturizer Hanasui Hijau", ingredients: "5x Ceramide, Niacinamide & Hyaluronic Acid", harga: "38rb", ukuran: "30ml", cocok: "Kering, Skin Barrier Rusak, Kemerahan, Sensitif", waktu: "Pagi dan Malam", urutan: "serum → MOISTURIZER → sunscreen", tekstur: "Agak Kental", review: "Ini diborong semua! Skin barrier rusak, sensitif, mencerahkan bisa." },
        { img: "moist2.jpg", nama: "Moisturizer Hanasui Orange", ingredients: "5x Ceramide, 5% Niacinamide & Tranexamic Acid", harga: "38rb", ukuran: "30ml", cocok: "Kering, Skin Barrier Rusak, Mencerahkan dan Bekas Jerawat", waktu: "Pagi dan Malam", urutan: "serum → MOISTURIZER → sunscreen", tekstur: "Gel", review: "Untuk mencerahkan butuh waktu sih, coba aja." }
    ],
    "Sunscreen": [
        { img: "sunscreen1.jpg", nama: "Sunscreen Hanasui SPF 30 PA+++", ingredients: "Chemical | Finish: Glowing", harga: "28rb", ukuran: "30ml", cocok: "Kombinasi", waktu: "Pagi", urutan: "moisturizer → SUNSCREEN", tekstur: "Gel", review: "Biasa aja, ringan, pemula friendly dan ga whitecast." },
        { img: "sunscreen2.jpg", nama: "Sunscreen Hanasui SPF 50 PA++++", ingredients: "Chemical | Finish: Glowing", harga: "38rb", ukuran: "30ml", cocok: "Kombinasi", waktu: "Pagi", urutan: "moisturizer → SUNSCREEN", tekstur: "Gel", review: "Walaupun SPF 50 tapi ga berat, affordable, ga ada whitecast." },
        { img: "sunscreen3.jpg", nama: "Sunscreen Glamazing SPF 50 PA+++", ingredients: "Physical | Finish: Matte", harga: "60rb", ukuran: "50ml", cocok: "Kering", waktu: "Pagi", urutan: "moisturizer → SUNSCREEN", tekstur: "Cream", review: "Tone up keliatan banget bikin cerah, bagus buat cool tone." },
        { img: "sunscreen4.jpg", nama: "Sunscreen Madam Gie SPF 35 PA+++", ingredients: "Hybrid | Finish: Glowing", harga: "38rb", ukuran: "50ml", cocok: "Kombinasi", waktu: "Pagi", urutan: "moisturizer → SUNSCREEN", tekstur: "Gel", review: "Tone up ga lebay dan bisa buat calming." },
        { img: "sunscreen5.jpg", nama: "Sunscreen Acnaway SPF 35 PA+++", ingredients: "Chemical | Finish: Matte", harga: "40rb", ukuran: "30ml", cocok: "Berminyak", waktu: "Pagi", urutan: "moisturizer → SUNSCREEN", tekstur: "Gel", review: "Biasa aja, ringan dan ga whitecast." },
        { img: "sunscreen6.jpg", nama: "Sunscreen El formula SPF 50 PA+++", ingredients: "Hybrid | Finish: Matte", harga: "70rb", ukuran: "50ml", cocok: "Kombinasi", waktu: "Pagi", urutan: "moisturizer → SUNSCREEN", tekstur: "Watery", review: "Packaging unik kaya telor, ringan banget kaya air." }
    ]
};

// Navigasi Pindah Layar
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if(screenId === 'interview-screen') {
        renderQuizStep(1);
    }
}

// Buka Kategori Produk Apapun
function openCategory(categoryName) {
    document.getElementById('category-title').innerText = `Koleksi ${categoryName}`;
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    
    const products = skincareDatabase[categoryName] || [];
    
    if(products.length === 0) {
        container.innerHTML = `<p style="grid-column: span 4; color: #888;">Belum ada produk untuk kategori ini.</p>`;
    } else {
        products.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.innerHTML = `<img src="${item.img}" alt="${item.nama}" onerror="this.src='https://via.placeholder.com/150x225?text=No+Image'" onclick="openModal('${categoryName}', ${index})">`;
            container.appendChild(div);
        });
    }
    
    switchScreen('product-list-screen');
}

// State Kuis Interview
let quizState = { skinType: '', problems: [], budget: '' };

function renderQuizStep(step) {
    const container = document.getElementById('quiz-container');
    
    if (step === 1) {
        container.innerHTML = `
            <h3>Bagaimana tipe kulit kamu saat ini?</h3>
            <div class="quiz-options">
                <button class="menu-btn" onclick="setSkinType('Kering')">Kering</button>
                <button class="menu-btn" onclick="setSkinType('Sangat Kering')">Sangat Kering</button>
                <button class="menu-btn" onclick="setSkinType('Berminyak')">Berminyak</button>
                <button class="menu-btn" onclick="setSkinType('Sangat Berminyak')">Sangat Berminyak</button>
                <button class="menu-btn" onclick="setSkinType('Kombinasi')">Kombinasi</button>
            </div>
        `;
    } else if (step === 2) {
        container.innerHTML = `
            <h3>Apa fokus permasalahan kulit kamu?</h3>
            <div class="quiz-checkbox-grid">
                <label><input type="checkbox" value="Jerawat"> Jerawat Aktif</label>
                <label><input type="checkbox" value="Beruntusan"> Beruntusan</label>
                <label><input type="checkbox" value="Bekas Jerawat"> Bekas Jerawat</label>
                <label><input type="checkbox" value="Komedo"> Komedo</label>
                <label><input type="checkbox" value="Pori"> Pori-pori Besar</label>
                <label><input type="checkbox" value="Kusam"> Kulit Kusam</label>
                <label><input type="checkbox" value="Sensitif"> Sensitif / Kemerahan</label>
                <label><input type="checkbox" value="Skin Barrier"> Skin Barrier Rusak</label>
            </div>
            <button class="menu-btn" style="margin-top:20px; width:100%;" onclick="saveProblems()">Next ➡</button>
        `;
    } else if (step === 3) {
        container.innerHTML = `
            <h3>Berapa rata-rata budget produk kamu?</h3>
            <div class="quiz-options">
                <button class="menu-btn" onclick="setBudget('Dibawah 50rb')">Di bawah Rp 50.000</button>
                <button class="menu-btn" onclick="setBudget('Diatas 50rb')">Di atas Rp 50.000</button>
            </div>
        `;
    } else if (step === 4) {
        showQuizResults();
    }
}

function setSkinType(type) {
    quizState.skinType = type;
    renderQuizStep(2);
}

function saveProblems() {
    const checkboxes = document.querySelectorAll('#quiz-container input[type="checkbox"]:checked');
    quizState.problems = Array.from(checkboxes).map(cb => cb.value);
    renderQuizStep(3);
}

function setBudget(budget) {
    quizState.budget = budget;
    renderQuizStep(4);
}

function showQuizResults() {
    const container = document.getElementById('quiz-container');
    let matchedProduct = skincareDatabase["Facewash"][0];
    
    skincareDatabase["Facewash"].forEach(item => {
        if(item.cocok.toLowerCase().includes(quizState.skinType.toLowerCase())) {
            matchedProduct = item;
        }
    });

    container.innerHTML = `
        <h3 style="color: #D81B60;">Hasil Rekomendasi Skincare Buat Kamu 🎉</h3>
        <p style="font-size: 13px; margin-bottom: 12px;">Berdasarkan tipe kulit <strong>${quizState.skinType}</strong>:</p>
        <div style="background: #FFF0F3; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 15px; text-align: left;">
            <img src="${matchedProduct.img}" style="width: 60px; height: 90px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://via.placeholder.com/60x90?text=No+Img'">
            <div>
                <h4 style="margin: 0 0 4px 0; color: #D81B60; font-size: 15px;">${matchedProduct.nama}</h4>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Harga:</strong> ${matchedProduct.harga} (${matchedProduct.ukuran})</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Cocok:</strong> ${matchedProduct.cocok}</p>
            </div>
        </div>
        <button class="menu-btn" style="margin-top: 15px; width: 100%;" onclick="switchScreen('home-screen')">Ulangi Interview</button>
    `;
}

// Pop-up Detail Produk
function openModal(categoryName, index) {
    const product = skincareDatabase[categoryName][index];
    const detailsDiv = document.getElementById('modal-details');
    
    detailsDiv.innerHTML = `
        <img src="${product.img}" class="detail-img" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
        <h3 style="color: #D81B60; margin-bottom: 12px;">${product.nama}</h3>
        <p><strong>Kategori:</strong> ${categoryName}</p>
        <p><strong>Harga & Ukuran:</strong> ${product.harga} | ${product.ukuran}</p>
        <p><strong>Main Ingredients:</strong> ${product.ingredients}</p>
        <p><strong>Cocok untuk:</strong> ${product.cocok}</p>
        <p><strong>Tekstur:</strong> ${product.tekstur}</p>
        <p><strong>Waktu Pakai:</strong> ${product.waktu}</p>
        <p><strong>Urutan:</strong> ${product.urutan}</p>
        <div style="background: #fff; padding: 12px; border-radius: 10px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <p style="color: #D81B60; margin: 0 0 5px 0;"><strong>⭐ Honest Review</strong></p>
            <p style="font-style: italic; margin: 0;">"${product.review}"</p>
        </div>
    `;
    
    document.getElementById('product-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}