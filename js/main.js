var arrayPanels = [];

var feed1;
var feed2;
var feed3;
var feed4;
var feed5;

feed1 = new google.feeds.Feed("http://rss.allrecipes.com/daily.aspx?hubID=80");
feed2 = new google.feeds.Feed("http://www.kraftfoods.com/rss/topRatedRecipes.aspx");
feed3 = new google.feeds.Feed("http://www.food.com/rss");
feed4 = new google.feeds.Feed("http://feeds.feedburner.com/elise/simplyrecipes");
feed5 = new google.feeds.Feed("http://www.food.com/rssapi.do?page_type=26&slug=breakfast");

feed1.setNumEntries(4);
feed2.setNumEntries(3);
feed3.setNumEntries(3);
feed4.setNumEntries(3);
feed5.setNumEntries(5);
    
load_all_feeds();
window.onload = function () {

    load_breakfast_feeds();

}
$(document).ready(function () {

    $(".displayAll").on("click", function (e) {
        e.preventDefault();
        unselect_all_buttons();
        show_all_feeds();
    });

    $(".breakfast").on("click", function (e) {
        e.preventDefault();
        unselect_all_buttons();
        select_button(this);
        show_breakfast_feeds();
    });

    $(".lunch").on("click", function (e) {
        e.preventDefault();
        unselect_all_buttons();
        select_button(this);
        show_lunch_feeds();
    });

    $(".dinner").on("click", function (e) {
        e.preventDefault();
        unselect_all_buttons();
        select_button(this);
        show_dinner_feeds();
    });

});

function load_breakfast_feeds() {
    var allEntries = $(".panel.entry", $(".allFeedsPanel")).toArray();
    allEntries.forEach(function (entry) {
        var link = $(entry).find(".entryLink");
        var breakfast_words = ['breakfast', 'eggs', 'pancakes', 'waffles', 'toast', 'brunch', 'bacon'];

        $.embedly.extract(link.href, { key: '968ebde32bab42d7b5e679ecb09d0560' }).progress(function (obj) {
            obj.keywords = obj.keywords.slice(0, 5);
            var words = obj.keywords.toArray();
            words.forEach(function (word) {
                if (breakfast_words.indexOf(word.name) >= 0) {
                    add_entry_to_panel(".bPanel", entry);
                }
            });
        });
    });
}

function load_lunch_feeds() {
    var allEntries = $(".panel.entry", $(".allFeedsPanel")).toArray();
    allEntries.forEach(function (entry) {
        var link = $(entry).find(".entryLink");
        var lunch_words = ['lunch', 'sandwich', 'sandwiches', 'soup', 'burgers', 'pizza', 'chicken', 'salad', 'fish'];

        $.embedly.extract(link.href, { key: '968ebde32bab42d7b5e679ecb09d0560' }).progress(function (obj) {
            obj.keywords = obj.keywords.slice(0, 5);
            var words = obj.keywords.toArray();
            words.forEach(function (word) {
                if (lunch_words.indexOf(word.name) >= 0) {
                    add_entry_to_panel(".bPanel", entry);
                }
            });
        });
    });
}

function add_entry_to_panel(panelSelector, entry) {
    var entryTemplate = $(".entry", $(".templates")).clone();
    var title = entryTemplate.find(".entryTitle");
    var pubDate = entryTemplate.find(".entryDate");
    var content = entryTemplate.find(".entryContent");
    var link = entryTemplate.find(".entryLink");

    if (entry.categories.length > 0) {
        var tags = entryTemplate.find(".tags");

        entry.categories.forEach(function (tag) {
            var tagItem = $(".tagItem", $(".templates")).clone();
            tagItem.text(tag);
            tags.append(tagItem);
        });
    }

    title.text(entry.title);
    pubDate.text(entry.publishedDate);
    content.html(entry.content);
    link.html(entry.link).attr("href", entry.link);

    $(panelSelector).append(entryTemplate);
}

function show_all_feeds() {

}

function show_breakfast_feeds() {
    var activePanel = $(".active");
    $(activePanel).removeClass("active").addClass("dormant");
    $(".bPanel").removeClass("dormant").addClass("active");
}

function show_lunch_feeds() {
    var activePanel = $(".active");
    $(activePanel).removeClass("active").addClass("dormant");
    $(".lPanel").removeClass("dormant").addClass("active");
}

function show_dinner_feeds() {
    var activePanel = $(".active");
    $(activePanel).removeClass("active").addClass("dormant");
    $(".dPanel").removeClass("dormant").addClass("active");
}

function unselect_all_buttons() {
    var buttons = $(".medium.button").toArray();
    buttons.forEach(function (button) {
        $(button).removeClass("success");
    });
}

function select_button(button) {
    $(button).addClass("success");
}

function load_all_feeds(callback) {
    feed1.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_feed_entries(entries);
        }
    });

    feed2.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_feed_entries(entries);
        }
    });

    feed4.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_feed_entries(entries);
        }
    });

    feed5.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_feed_entries(entries);
        }
    });
}

function display_feed_entries(entries) {
    entries.forEach(function (entry) {
        add_entry_to_panel(".allFeedsPanel", entry);
    });
}