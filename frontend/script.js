document.getElementById('komentar-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var komentarInput = document.getElementById('komentar-input');
    var namaInput = document.getElementById('nama-input');
    var komentarList = document.getElementById('komentar-list');
    
    var komentarItem = document.createElement('div');
    komentarItem.className = 'komentar-item';
    
    var nama = document.createElement('h4');
    nama.textContent = namaInput.value;
    
    var komentar = document.createElement('p');
    komentar.textContent = komentarInput.value;
    
    komentarItem.appendChild(nama);
    komentarItem.appendChild(komentar);
    
    komentarList.appendChild(komentarItem);
    
    komentarInput.value = '';
    namaInput.value = '';
});
