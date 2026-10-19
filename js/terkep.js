(function () {
    'use strict';

    var REGIONS = {
        amazonas: {
            name: 'Amazonas', continent: 'Dél-Amerika', color: '#2f9e57',
            countries: 'Brazília, Peru, Kolumbia és további országok',
            desc: 'A Föld legnagyobb összefüggő esőerdeje. Az Amazonas folyó és több ezer mellékfolyója járja át, a fák párologtatása pedig a térség csapadékának jelentős részét adja.',
            animals: ['jaguár', 'rózsaszín folyami delfin', 'hárpia', 'óriás vidra', 'tukán'],
            plants: ['paradiófa', 'kaucsukfa', 'viktória-tavirózsa'],
            threats: 'erdőirtás legeltetés és szójaültetvények miatt, bányászat, tüzek',
            polys: [[[5, -72], [7, -62], [3, -52], [-1, -48], [-6, -47], [-10, -52], [-14, -57], [-12, -65], [-10, -72], [-4, -77], [1, -76]]]
        },
        kongo: {
            name: 'Kongó-medence', continent: 'Afrika', color: '#e8871e',
            countries: 'Kongói Demokratikus Köztársaság, Kongói Köztársaság, Gabon, Kamerun',
            desc: 'A világ második legnagyobb összefüggő trópusi esőerdeje. Hatalmas mocsárerdők és faóriások jellemzik, és a Kongó folyó medencéjében fekszik.',
            animals: ['nyugati gorilla', 'bonobó', 'okapi', 'erdei elefánt', 'szürke papagáj'],
            plants: ['faóriások', 'mocsárerdők növényzete', 'epifiton orchideák'],
            threats: 'fakitermelés, mezőgazdasági területek terjedése, vadászat, bányászat',
            polys: [[[4, 9], [5, 17], [3, 26], [0, 30], [-4, 29], [-7, 24], [-6, 16], [-3, 11], [1, 9]]]
        },
        azsia: {
            name: 'Délkelet-Ázsia', continent: 'Ázsia', color: '#c8325a',
            countries: 'Indonézia, Malajzia, Thaiföld, Brunei és további országok',
            desc: 'Szigetek és félszigetek változatos esőerdői, például Borneó és Szumátra erdői. A dipterokarpusz fák adják a lombkorona jellegzetes magas szintjét.',
            animals: ['orangután', 'szumátrai tigris', 'ázsiai elefánt', 'maláj medve', 'repülő gyík'],
            plants: ['rafflesia', 'dipterokarpusz fák', 'kancsóka'],
            threats: 'pálmaolaj-ültetvények, fakitermelés, erdőtüzek',
            polys: [
                [[7, 117], [4, 119], [1, 118], [-3, 116], [-4, 114], [-2, 110], [2, 109], [5, 115]],
                [[5.5, 95.5], [3, 98.5], [-1, 103], [-5, 105], [-5.5, 104], [-2, 100], [1, 97], [4, 95.5]],
                [[12, 99], [7, 100.5], [2, 104], [1.5, 102.5], [5, 99.5], [9, 98.5]]
            ]
        },
        ujguinea: {
            name: 'Új-Guinea', continent: 'Óceánia', color: '#6d4bc2',
            countries: 'Pápua Új-Guinea és Indonézia (Pápua tartományok), valamint Ausztrália északkeleti partvidéke',
            desc: 'A világ egyik legnagyobb és legkevésbé feltárt esőerdős területe. Magas hegyek és mély völgyek tagolják, ezért sok faj él itt, amely sehol máshol nem fordul elő.',
            animals: ['paradicsommadarak', 'fakenguru', 'kazuár', 'hosszúcsőrű tüskésfejű'],
            plants: ['több ezer orchideafaj', 'páfrányfák', 'rododendronok'],
            threats: 'bányászat, fakitermelés, pálmaolaj-ültetvények',
            polys: [
                [[-1, 133], [-2.5, 138], [-3, 142], [-6, 146], [-9, 147], [-9, 143], [-8.5, 139], [-4.5, 136]],
                [[-11.5, 142.5], [-15, 145], [-19, 146.2], [-17, 145], [-13, 143]]
            ]
        }
    };

    var mapEl = document.getElementById('map');
    var infoEl = document.getElementById('regionInfo');
    if (!mapEl || typeof L === 'undefined') {
        if (infoEl) infoEl.textContent = 'A térkép nem tölthető be. Ellenőrizd az internetkapcsolatot.';
        return;
    }

    var map = L.map(mapEl, { minZoom: 1, maxZoom: 8, scrollWheelZoom: false, worldCopyJump: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_4omy_1_86fa2436d601defd5627a4f4', {
        attribution: '&copy; OpenStreetMap közreműködők &copy; CARTO',
        subdomains: 'abcd'
    }).addTo(map);

    var allBounds = [[-22, -80], [10, 150]];
    map.fitBounds(allBounds, { padding: [10, 10] });
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

    var layers = {};
    var activeId = null;

    function style(id, active) {
        return {
            color: '#ffffff', weight: active ? 3 : 1.5,
            fillColor: REGIONS[id].color, fillOpacity: active ? 0.85 : 0.6
        };
    }

    Object.keys(REGIONS).forEach(function (id) {
        var r = REGIONS[id];
        var group = L.featureGroup(r.polys.map(function (p) {
            return L.polygon(p, style(id, false));
        })).addTo(map);
        group.bindTooltip(r.name, { sticky: true });
        group.on('click', function () { select(id, true); });
        group.on('mouseover', function () { if (activeId !== id) group.setStyle({ fillOpacity: 0.8 }); });
        group.on('mouseout', function () { if (activeId !== id) group.setStyle(style(id, false)); });
        layers[id] = group;
    });

    function list(items) {
        return items.map(function (i) { return '<li>' + i + '</li>'; }).join('');
    }

    function render(id) {
        var r = REGIONS[id];
        infoEl.innerHTML =
            '<div class="info-head"><span class="legend-dot" style="background:' + r.color + '"></span>' +
            '<span class="info-continent">' + r.continent + '</span></div>' +
            '<h3 class="info-title">' + r.name + '</h3>' +
            '<p class="info-text">' + r.desc + '</p>' +
            '<dl class="info-list">' +
            '<dt>Országok</dt><dd>' + r.countries + '</dd>' +
            '<dt>Jellegzetes állatok</dt><dd><ul>' + list(r.animals) + '</ul></dd>' +
            '<dt>Jellegzetes növények</dt><dd><ul>' + list(r.plants) + '</ul></dd>' +
            '<dt>Fő veszélyek</dt><dd>' + r.threats + '</dd></dl>' +
            '<button type="button" class="btn-ghost-sm" id="resetMap">Vissza a világtérképhez</button>';
        document.getElementById('resetMap').addEventListener('click', reset);
    }

    function select(id, fly) {
        activeId = id;
        Object.keys(layers).forEach(function (k) { layers[k].setStyle(style(k, k === id)); });
        document.querySelectorAll('.legend-item[data-region]').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-region') === id);
        });
        render(id);
        if (fly) map.flyToBounds(layers[id].getBounds(), { padding: [30, 30], maxZoom: 5, duration: 0.8 });
    }

    function reset() {
        activeId = null;
        Object.keys(layers).forEach(function (k) { layers[k].setStyle(style(k, false)); });
        document.querySelectorAll('.legend-item.active').forEach(function (b) { b.classList.remove('active'); });
        infoEl.innerHTML = '<p class="small-muted mb-0">Válassz ki egy régiót a térképen vagy a jelmagyarázatban, és itt megjelennek a részletei.</p>';
        map.flyToBounds(allBounds, { padding: [10, 10], duration: 0.8 });
    }

    document.querySelectorAll('[data-region]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            var id = el.getAttribute('data-region');
            if (!REGIONS[id]) return;
            e.preventDefault();
            if (el.classList.contains('btn-main')) {
                var target = document.getElementById('terkep');
                var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            }
            select(id, true);
        });
    });
})();