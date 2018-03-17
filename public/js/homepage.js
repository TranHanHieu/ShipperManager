function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
var dataCache;
var pageCount = 1;
var startedSearch = false;
var searchType = 0;
var isLoading = false;
var isEndPage = false;
var iframeWidth = $(window).width() < 768 ? $(window).width() : 360;
var numberOfCategoriesLoaded = 0;

$('#index').hide();

var $grid = $('.grid').isotope({
    masonry: {
        columnWidth: iframeWidth,
        gutter: 10,
        fitWidth: true
    },
    itemSelector: '.grid-item',
    isAnimated: true,
    animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
    }
});

var $gridFood = $('.gridFood').isotope({
    masonry: {
        columnWidth: iframeWidth,
        gutter: 10,
        fitWidth: true
    },
    itemSelector: '.grid-item',
    isAnimated: true,
    animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
    }
});

var $gridFashion = $('.gridFashion').isotope({
    masonry: {
        columnWidth: iframeWidth,
        gutter: 10,
        fitWidth: true
    },
    itemSelector: '.grid-item',
    isAnimated: true,
    animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
    }
});

var $gridNews = $('.gridNews').isotope({
    masonry: {
        columnWidth: iframeWidth,
        gutter: 10,
        fitWidth: true
    },
    itemSelector: '.grid-item',
    isAnimated: true,
    animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
    }
});

var $gridFilms = $('.gridFilms').isotope({
    masonry: {
        columnWidth: iframeWidth,
        gutter: 10,
        fitWidth: true
    },
    itemSelector: '.grid-item',
    isAnimated: true,
    animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
    }
});

var $gridSports = $('.gridSports').isotope({
    masonry: {
        columnWidth: iframeWidth,
        gutter: 10,
        fitWidth: true
    },
    itemSelector: '.grid-item',
    isAnimated: true,
    animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
    }
});

var $hiddenGrid = $('#hidden-grid');

var $loading = $('.loading');
// console.log("hide loading");

$grid.height(0);
$grid.hide();
// console.log("hide grid");

window.fbAsyncInit = function() {
    FB.init({
        appId: '132173900762693',
        autoLogAppEvents: true,
        status: true,
        xfbml: true,
        version: 'v2.10'
    });
    FB.Event.subscribe('xfbml.render', function() {
        if (dataCache != undefined) {
            $.ajax({
                type: "get",
                url: "/user/getPostsURL",
                success: function(data) {
                    if (data == 401) {
                        $(document.body).find(".grid-item").each((index, item) => {
                            if ($(item).find('.save-btn').length == 0) {
                                var favoriteBtn = document.createElement("img");
                                favoriteBtn.className = "save-btn";
                                favoriteBtn.setAttribute("data-toggled", "false");
                                favoriteBtn.setAttribute("src", "/res/favorite_border.png");
                                favoriteBtn.setAttribute("data-href", $(item).attr("data-href"));
                                const $favoriteBtn = $(favoriteBtn);
                                $(item).find("span").append($favoriteBtn);
                                $(item).find("span").addClass("fb-xfbml-parse-ignore");
                            }
                        });
                    } else {
                        $(document.body).find(".grid-item").each((index, item) => {
                            if ($(item).find('.save-btn').length == 0) {
                                var favoriteBtn = document.createElement("img");
                                favoriteBtn.className = "save-btn";
                                if (data.indexOf($(item).attr("data-href")) == -1) {
                                    favoriteBtn.setAttribute("data-toggled", "false");
                                    favoriteBtn.setAttribute("src", "/res/favorite_border.png");
                                } else {
                                    favoriteBtn.setAttribute("data-toggled", "true");
                                    favoriteBtn.setAttribute("src", "/res/favorite_fill.png");
                                }
                                favoriteBtn.setAttribute("data-href", $(item).attr("data-href"));
                                const $favoriteBtn = $(favoriteBtn);
                                $(item).find("span").append($favoriteBtn);
                                $(item).find("span").addClass("fb-xfbml-parse-ignore");
                            }
                        });
                    }
                    if (dataCache.length < 12 && $('#current-tab').text() != "Trang chủ") {
                        if ($loading.is(":visible")) {
                            $loading.hide();
                        }
                    }
                    if (!$grid.is(":visible")) {
                        $grid.show();
                        // console.log("show grid");
                    }
                    isLoading = false;
                    // console.log("Another SWAP");
                    startedSearch = true;
                }
            });
        }
    });
    // console.log('fb initialized');
    getHighlightPosts();
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.async = false;
    js.src = js.src = "//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.10&appId=132173900762693";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function getHighlightPostsOfOneCategory(id, callback, gridOfCategory) {
    $.ajax({
        url: "/posts/" + id + "/1",
        success: function(data) {
            var dataShow = [];
            for (var i = 0; i < 4; i++) {
                dataShow.push(data[i]);
            }
            callback(dataShow, gridOfCategory);
        }
    });
}

function getHighlightPosts() {
    $('#current-tab').text("Trang chủ");
    $('.panel-fav-urls').css('display', 'none');
    getHighlightPostsOfOneCategory('food', fillCategoryPosts, $gridFood);
    getHighlightPostsOfOneCategory('fashion', fillCategoryPosts, $gridFashion);
    getHighlightPostsOfOneCategory('news', fillCategoryPosts, $gridNews);
    getHighlightPostsOfOneCategory('films', fillCategoryPosts, $gridFilms);
    getHighlightPostsOfOneCategory('sports', fillCategoryPosts, $gridSports);
}

function showHighlightPosts() {
    $('#current-tab').text("Trang chủ");
    searchType = 0;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $('#index').css('display', 'block');
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    if ($loading.is(":visible")) {
        $loading.hide();
    }
}

function getPostsOfFavPages() {
    $('.addFavUrl').css('display', 'block');
    $('.panel-fav-urls').css('display', 'block');
    $('#current-tab').text("Yêu thích");
    $('#index').css('display', 'none');
    searchType = 0;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $loading.hide();
    setInterval(getPostsFromFavUrls(), 200);
    setInterval(getSavedFavUrls(), 200);
}

function getPostsAboutFood() {
    $('#index').css('display', 'none');
    $('#current-tab').text("Ăn uống");
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    isLoading = true;
    isEndPage = false;
    searchType = 1;
    pageCount = 1;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $.ajax({
        url: "/posts/" + 'food' + "/1",
        success: function(data) {
            fillPostsLayout(data);
        }
    });
}

function getPostsAboutFashion() {
    $('#index').css('display', 'none');
    $('#current-tab').text("Thời trang");
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    isLoading = true;
    isEndPage = false;
    searchType = 2;
    pageCount = 1;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $.ajax({
        url: "/posts/" + 'fashion' + "/1",
        success: function(data) {
            fillPostsLayout(data);
        }
    });
}

function getPostsAboutNews() {
    $('#index').css('display', 'none');
    $('#current-tab').text("Tin tức");
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    isLoading = true;
    isEndPage = false;
    searchType = 3;
    pageCount = 1;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $.ajax({
        url: "/posts/" + 'news' + "/1",
        success: function(data) {
            fillPostsLayout(data);
        }
    });
}

function getPostsAboutSports() {
    $('#index').css('display', 'none');
    $('#current-tab').text("Thể thao");
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    isLoading = true;
    isEndPage = false;
    searchType = 6;
    pageCount = 1;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $.ajax({
        url: "/posts/" + 'sports' + "/1",
        success: function(data) {
            fillPostsLayout(data);
        }
    });
}

function getPostsAboutFilms() {
    $('#index').css('display', 'none');
    $('#current-tab').text("Phim ảnh");
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    isLoading = true;
    isEndPage = false;
    searchType = 7;
    pageCount = 1;
    $grid.hide();
    $grid.empty();
    $grid.height(0);
    $.ajax({
        url: "/posts/" + 'films' + "/1",
        success: function(data) {
            fillPostsLayout(data);
        }
    });
}

function getFavPosts() {
    $('#index').css('display', 'none');
    $('.addFavUrl').css('display', 'none');
    $('.panel-fav-urls').css('display', 'none');
    $.ajax({
        type: "get",
        url: "/user/getPosts/1",
        success: function(data) {
            if (data == 401) {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
            } else {
                $('#current-tab').text("Bài đã lưu");
                isLoading = true;
                isEndPage = false;
                searchType = 4;
                pageCount = 1;
                $grid.hide();
                $grid.empty();
                $grid.height(0);
                fillPostsLayout(data);
            }
        }
    });
}

function deleteFavUrl(idToDelete) {
    $.ajax({
        type: "post",
        url: "/user/deleteFavUrl",
        data: {
            id : idToDelete
        }
    }).then((data) => {
        if (data == "401") {
            swal(
                'Oops...',
                'Bạn cần đăng nhập trước đã !',
                'error'
            )
            $grid.hide();
            $grid.empty();
            $grid.height(0);
        } else {
            $('.form-control.favUrl.url').val("");
            getPostsFromFavUrls();
            getSavedFavUrls();
        }
    });
}



const sumbitFavUrl = (favUrl) => {
    $.ajax({
        type: "post",
        url: "user/saveFavUrl",
        data: {
            url: favUrl
        }
    }).then((data) => {
        $('#submitFavUrlBtn').prop('disabled', false);
        // console.log(data);
        if (data == "401") {
            swal(
                'Oops...',
                'Bạn cần đăng nhập trước đã !',
                'error'
            )
        } else {
            $('.form-control.favUrl.url').val("");
            getPostsFromFavUrls();
            getSavedFavUrls();
        }
    });
}

function getSavedFavUrls() {
    $.ajax({
        type: "get",
        url: "user/getFavUrls",
        success: function(data) {
            if (data == 401) {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
            } else {
                $('body').find('.showFavUrl').empty();
                // console.log(data);
                if (data.length != 0) {
                    data.forEach(function(item) {
                        var divControl = document.createElement("div");
                        divControl.className = "favUrls";
                        var para2 = document.createElement("p");
                        para2.className = "page-name";
                        para2.innerHTML = item.name;
                        var btn = document.createElement("button");
                        btn.className = "remove-page-btn";
                        btn.innerHTML = "<i class= \"fa fa-minus\" aria-hidden=\"true\"></i>" + "Xóa";
                        btn.setAttribute("data-id", item.id);
                        divControl.appendChild(para2);
                        divControl.appendChild(btn);
                        $('body').find('.showFavUrl').append(divControl);
                    })
                }
            }
        }
    })
}

function getPostsFromFavUrls() {
    $.ajax({
        type: "get",
        url: "/user/getPostsFromFavUrls/1",
        success: function(data) {
            if (data == 401) {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
                $grid.hide();
                $grid.empty();
                $grid.height(0);
            } else {
                $('#current-tab').text("Yêu thích");
                isLoading = true;
                isEndPage = false;
                searchType = 5;
                pageCount = 1;
                $grid.hide();
                $grid.empty();
                $grid.height(0);
                fillPostsLayout(data);
            }
        }
    });
}


fillPostsLayout = (data) => {
    $hiddenGrid.empty();
    if (!$loading.is(":visible")) {
        $loading.show();
    }
    dataCache = data;
    // console.log("data fill ", data);
    for (post in data) {
        var newPost = document.createElement("div");
        newPost.className = "fb-post grid-item";
        newPost.setAttribute("data-href", data[post].permalink_url);
        newPost.setAttribute("data-width", iframeWidth);
        newPost.setAttribute("data-show-text", true);
        const $newPost = $(newPost);
        $grid.append($newPost).isotope('appended', $newPost);
        $grid.isotope('layout');
    }
    FB.XFBML.parse($grid[0]);
}

fillCategoryPosts = (data, gridOfCategory) => {
    if (!$loading.is(":visible")) {
        $loading.show();
    }
    dataCache = data;
    // console.log(data);
    for (post in data) {
        var newPost = document.createElement("div");
        newPost.className = "fb-post grid-item";
        newPost.setAttribute("data-href", data[post].permalink_url);
        newPost.setAttribute("data-width", iframeWidth);
        newPost.setAttribute("data-show-text", true);
        newPost.setAttribute("data-post-id", data[post].id);

        const $newPost = $(newPost);
        gridOfCategory.append($newPost).isotope('appended', $newPost);
        gridOfCategory.isotope('layout');
    }
    FB.XFBML.parse(gridOfCategory[0], () => {
        numberOfCategoriesLoaded++;
        if (numberOfCategoriesLoaded == 5) {
            $('#index').show();
            $loading.hide();
        }
    });
}


appendPostsLayout = (data) => {
    // console.log("data append ", data);
    $hiddenGrid.empty();
    if (data.length != 0) {
        if (!$loading.is(":visible")) {
            $loading.show();
        }
        dataCache = data;
        for (post in data) {
            var newPost = document.createElement("div");
            newPost.className = "fb-post grid-item";
            newPost.setAttribute("data-href", data[post].permalink_url);
            newPost.setAttribute("data-width", iframeWidth);
            newPost.setAttribute("data-show-text", true);
            const $newPost = $(newPost);
            $hiddenGrid.append($newPost);
        }
        FB.XFBML.parse($hiddenGrid[0], () => {
            $hiddenGrid.find(".grid-item").each((index, item) => {
                $grid.append($(item)).isotope('appended', $(item));
                $grid.isotope('layout');
            });
            $hiddenGrid.empty();
        });
    } else {
        isEndPage = true;
        if ($loading.is(":visible")) {
            $loading.hide();
        }
        // console.log("no more data");
    }
}

function layoutIfNeeded() {
    var needUpdate = false;
    $grid.find(".grid-item").each((index, item) => {
        if ($(item).height() != $(item).attr("data-height")) {
            needUpdate = true;
        }
        $(item).attr("data-height", $(item).height());
    });
    if ($grid.width() != $grid.attr("data-width")) {
        needUpdate = true;
    }
    $grid.attr("data-width", $grid.width());

    $gridFashion.find(".grid-item").each((index, item) => {
        if ($(item).height() != $(item).attr("data-height")) {
            needUpdate = true;
        }
        $(item).attr("data-height", $(item).height());
    });
    if ($gridFashion.width() != $gridFashion.attr("data-width")) {
        needUpdate = true;
    }
    $gridFashion.attr("data-width", $gridFashion.width());

    $gridFood.find(".grid-item").each((index, item) => {
        if ($(item).height() != $(item).attr("data-height")) {
            needUpdate = true;
        }
        $(item).attr("data-height", $(item).height());
    });
    if ($gridFood.width() != $gridFood.attr("data-width")) {
        needUpdate = true;
    }
    $gridFood.attr("data-width", $gridFood.width());

    $gridNews.find(".grid-item").each((index, item) => {
        if ($(item).height() != $(item).attr("data-height")) {
            needUpdate = true;
        }
        $(item).attr("data-height", $(item).height());
    });
    if ($gridNews.width() != $gridNews.attr("data-width")) {
        needUpdate = true;
    }
    $gridNews.attr("data-width", $gridNews.width());

    $gridFilms.find(".grid-item").each((index, item) => {
        if ($(item).height() != $(item).attr("data-height")) {
            needUpdate = true;
        }
        $(item).attr("data-height", $(item).height());
    });
    if ($gridFilms.width() != $gridFilms.attr("data-width")) {
        needUpdate = true;
    }
    $gridFilms.attr("data-width", $gridFilms.width());

    $gridSports.find(".grid-item").each((index, item) => {
        if ($(item).height() != $(item).attr("data-height")) {
            needUpdate = true;
        }
        $(item).attr("data-height", $(item).height());
    });
    if ($gridSports.width() != $gridSports.attr("data-width")) {
        needUpdate = true;
    }
    $gridSports.attr("data-width", $gridSports.width());

    if (needUpdate) {
        $grid.isotope('layout');
        $gridFood.isotope('layout');
        $gridFashion.isotope('layout');
        $gridNews.isotope('layout');
        $gridFilms.isotope('layout');
        $gridSports.isotope('layout');
    }
}

$('body').on('click', '.save-btn', function() {
    var clickedBtn = $(this);
    clickedBtn.attr("src", "res/loading_2.gif");
    clickedBtn.prop("disabled", true);
    if (clickedBtn.attr("data-toggled") == "true") {
        // console.log("deleted favorite post id ", clickedBtn.attr("data-href"));
        $.ajax({
            type: "post",
            url: "/user/deletePost",
            data: {
                post: clickedBtn.attr("data-href")
            }
        }).then((data) => {
            // console.log(data);
            if (data == "401") {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
                clickedBtn.attr("src", "/res/favorite_fill.png");
                clickedBtn.prop("disabled", false);
            } else {
                // console.log("deleted succesfully");
                clickedBtn.attr("src", "/res/favorite_border.png");
                clickedBtn.attr("data-toggled", "false");
                clickedBtn.prop("disabled", false);
            }
        });
    } else if (clickedBtn.attr("data-toggled") == "false") {
        // console.log("saved favorite post id ", clickedBtn.attr("data-href"));
        $.ajax({
            type: "post",
            url: "/user/savePost",
            data: {
                post: clickedBtn.attr("data-href")
            }
        }).then((data) => {
            // console.log(data);
            if (data == "401") {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
                clickedBtn.attr("src", "/res/favorite_border.png");
                clickedBtn.prop("disabled", false);
            } else {
                // console.log("saved succesfully");
                clickedBtn.attr("src", "/res/favorite_fill.png");
                clickedBtn.attr("data-toggled", "true");
                clickedBtn.prop("disabled", false);
            }
        });
    }
});

setInterval(layoutIfNeeded, 200);

//Endless Scroll
$(window).on('scroll', onWindowScrolled);

var interval = setInterval(function() {
    if ($(document).height() <= $(window).height()) {
        onWindowScrolled();
    } else {
        clearInterval(interval);
    }
}, 200);

requestNextPage();

function onWindowScrolled() {
    if (!isEndPage && !isLoading && $(window).height() * 3 / 2 + $(window).scrollTop() > $(document).height() - 100) {
        requestNextPage();
    }
}

function requestNextPage() {
    if (startedSearch) {
        if (searchType === 1) {
            getNextPostsAboutFood();
            // console.log("Getting new data");
        }
        if (searchType === 2) {
            getNextPostsAboutFashion();
            // console.log("Getting new data");
        }
        if (searchType === 3) {
            getNextPostsAboutNews();
            // console.log("Getting new data");
        }
        if (searchType === 4) {
            getNextFavPosts();
            // console.log("Getting new data");
        }

        if (searchType === 5) {
            getNextPostsFromFavUrls();
            // console.log("Getting new data");
        }

        if (searchType === 6) {
            getNextPostsAboutSports();
            // console.log("Getting new data");
        }

        if (searchType === 7) {
            getNextPostsAboutFilms();
            // console.log("Getting new data");
        }
    }
}

//Paginate
function getNextPostsAboutFood() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/posts/" + 'food' + `/${pageCount}`,
        success: function(data) {
            appendPostsLayout(data);
        }
    });
}

function getNextPostsAboutFashion() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/posts/" + 'fashion' + `/${pageCount}`,
        success: function(data) {
            appendPostsLayout(data);
        }
    });
}

function getNextPostsAboutNews() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/posts/" + 'news' + `/${pageCount}`,
        success: function(data) {
            appendPostsLayout(data);
        }
    });
}

function getNextPostsAboutFilms() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/posts/" + 'films' + `/${pageCount}`,
        success: function(data) {
            appendPostsLayout(data);
        }
    });
}

function getNextPostsAboutSports() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/posts/" + 'sports' + `/${pageCount}`,
        success: function(data) {
            appendPostsLayout(data);
        }
    });
}

function getNextFavPosts() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/user/" + 'getPosts' + `/${pageCount}`,
        success: function(data) {
            if (data == 401) {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
            } else {
                appendPostsLayout(data);
            }
        }
    });
}

function getNextPostsFromFavUrls() {
    isLoading = true;
    pageCount++;
    $.ajax({
        url: "/user/" + 'getPostsFromFavUrls' + `/${pageCount}`,
        success: function(data) {
            if (data == 401) {
                swal(
                    'Oops...',
                    'Bạn cần đăng nhập trước đã !',
                    'error'
                )
            } else {
                appendPostsLayout(data);
            }
        }
    });
}

$('.grid-item').on('load', function() {
    $(this).fadeIn(250);
}).each(function() {
    if (this.complete) {
        $(this).load();
    }
});
