jjunivSlider = window.jjunivSlider || {};

jjunivSlider.registrySlider = function (element) {
  let currentIdx = 0;
  let children = [];

  for (let c of element.children) {
    children.push(c);
  }

  let length = children.length;
  let speed = 4000;
  let rolling = true;

  let current = children[0];
  let prev = null;

  // 이전요소를 슬라이더 맨 뒤로 위치
  let pushPrevBack = function (e) {
    prev = e.target;

    element.removeChild(prev);
    element.appendChild(prev);

    e.target.removeEventListener("transitionend", pushPrevBack);
  };

  // current 요소를 초기화
  let next = function () {
    if (currentIdx < length - 1) {
      currentIdx++;
    } else {
      currentIdx = 0;
    }

    current.classList.remove("current");

    current.addEventListener("transitionend", pushPrevBack);

    slide();
  };

  // current가 동영상 요소이면 동영상이 종료될 때,
  // 아니면 speed로 지정한 시간 이후에 next 함수 호출
  let slide = function () {
    current = children[currentIdx];
    current.classList.add("current");

    console.log(current);

    if (current instanceof HTMLVideoElement) {
      current.play();
    } else {
      setTimeout(function () {
        if (rolling) next();
      }, speed);
    }
  };

  let videos = element.querySelectorAll("video");
  videos.forEach(function (v) {
    v.muted = true;
    v.addEventListener("ended", next);
  });

  // start: 슬라이더 시작
  // stop: 슬라이더 중지
  return {
    start: function () {
      rolling = true;
      slide();
    },
    stop: function () {
      rolling = false;
    },
  };
};

let test = null;

window.addEventListener("load", function () {
  // 페이지 로딩 후 jjuniv-slider 클래스를 가진 요소들에 슬라이더 적용
  let sliders = document.querySelectorAll(".jjuniv-slider");
  sliders.forEach(function (s) {
    let sliderInit = jjunivSlider.registrySlider(s);
    sliderInit.start();
    test = sliderInit;
  });
});
