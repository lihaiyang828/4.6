let pblModule = (function () {
    let columns = Array.from(document.querySelectorAll('.column'));
    let data = [];
    //获取数据
    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'json/data.json', false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
            }
        }
        xhr.send(null);
    }
    //数据绑定
    let bindHTML = function bindHTML() {
        data = data.map(item => {
            let h = item.height,
                w = item.width;
            h = h / (w / 230);
            item.width = 230;
            item.height = h;
            return item;
        });
        for (let i = 0; i < data.length; i += 3) {
            let group = data.slice(i, i + 3);
            group.sort((a, b) => {
                return b.height - a.height;
            });
            columns.sort((a, b) => {
                return a.offsetHeight - b.offsetHeight;
            });
            group.forEach((item, index) => {
                let {
                    pic,
                    title,
                    link,
                    height
                } = item;
                let card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<a href="${link}">
                        <div class="lazyImgBox" style="height:${height}px">
                            <img src="" alt="" data-image="${pic}">
                        </div>
                        <p>${title}</p>
                    </a>`;
                columns[index].appendChild(card);
            });
        }
    }
    //延迟加载
    let lazyFunc = function lazyFunc() {
        let lazyImgBoxs = document.querySelectorAll('.lazyImgBox');
        [].forEach.call(lazyImgBoxs, lazyImgBox => {
            let isLoad = lazyImgBox.getAttribute('isLoad');
            if (isLoad==='true') return;
            let A = utils.offset(lazyImgBox).top + lazyImgBox.offsetHeight / 2;
            let B = document.documentElement.clientHeight + document.documentElement.scrollTop;
            if (B >= A) {
                lazyImg(lazyImgBox);
            }
        });
    }
    //单个图片加载
    let lazyImg = function lazyImg(lazyImgBox) {
        let img = lazyImgBox.querySelector('img'),
            dataImg = img.getAttribute('data-image'),
            tempImg = new Image;
        tempImg.src = dataImg;
        tempImg.onload = function () {
            img.src = dataImg;
            utils.css(img, 'opacity', 1);
        }
        img.removeAttribute('data-image');
        tempImg = null;
        lazyImgBox.setAttribute('isLoad', 'true');
    }
    //加载更多
    let flag;
    let queryGroup = function queryGroup(){
        let HTML = document.documentElement;
        if(HTML.clientHeight*1.5+HTML.scrollTop>=HTML.scrollHeight){
            if(flag) return;
            flag = true;
            queryData();
            bindHTML();
            lazyFunc();
            flag = false;
        }
    }
    return {
        init() {
            queryData();
            bindHTML();
            lazyFunc();
            window.onscroll = function () {
                lazyFunc();
                queryGroup();
            }
        }
    }
})();
pblModule.init();