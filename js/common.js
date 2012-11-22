var site = (function() {

    var stickyEl = '.site-nav',
        $originalEl,
        $stickyEl;

    function handleScroll() {
        var windowScroll = window.scrollY,
            elementScroll = $originalEl.offsetTop;

        if (windowScroll > elementScroll) {
            if ($stickyEl.classList) {
                $stickyEl.classList.add('visible');
            } else {
                $stickyEl.setAttribute('class', $stickyEl.getAttribute('class') + ' visible');
            }
        } else {
            if ($stickyEl.classList) {
                $stickyEl.classList.remove('visible');
            } else {
                $stickyEl.setAttribute('class', $stickyEl.getAttribute('class').replace('visible', ''));
            }
        }
    }

    function setWidth() {
        $stickyEl.style.width = $originalEl.offsetWidth + 'px';
    }

    function setupNav() {

        $originalEl = document.querySelector(stickyEl);
        $stickyEl = $originalEl.cloneNode(true);

        if ($stickyEl.classList) {
            $stickyEl.classList.add('float');
        } else {
            $stickyEl.setAttribute('class', $stickyEl.getAttribute('class') + ' float');
        }

        $originalEl.parentNode.appendChild($stickyEl);
    }

    function setupDemos() {
        var $options = document.querySelector('.options ul');

        $options.addEventListener('click', function(e) {
            var el = e.target || e.srcElement,
                item = '',
                demoTitle = document.getElementById('demo-title'),
                demoArea = document.getElementById('demo-area'),
                demoFeature = document.getElementById('demo-feature');

            e.preventDefault();

            if (el.href.indexOf('#') > 0) {
                item = el.href.split('#')[1].replace('caniuse-', '');

                demoTitle.innerHTML = el.innerHTML;
                demoFeature.innerHTML = item;
                demoArea.setAttribute('data-feature', item);

                if (canIUse) {
                    canIUse.render('demo-area');
                }
            }
        });
    }

    function initEvents() {
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', setWidth, true);
    }

    (function init() {
        setupNav();
        setupDemos();
        initEvents();

        setWidth();
    })();


})();