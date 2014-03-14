var arrayPanels = [];

var feed1;
var feed2;
var feed3;
var feed4;
var feed5;

var breakfast_words = ['breakfast', 'pancakes', 'waffles', 'eggs', 'brunch', 'morning', 'bacon'];
var lunch_words = ['lunch', 'sandwiches'];
var dinner_words = ['dinner', 'casserole', 'burgers'];

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
    load_select_feed(".bPanel", breakfast_words);
    load_select_feed(".lPanel", lunch_words);
    load_select_feed(".dPanel", dinner_words);
}

$(document).ready(function () {

    $(".displayAll").on("click", function (e) {
        e.preventDefault();
        show_feed(".allFeedsPanel", this);
    });

    $(".breakfast").on("click", function (e) {
        e.preventDefault();
        show_feed(".bPanel", this);
    });

    $(".lunch").on("click", function (e) {
        e.preventDefault();
        show_feed(".lPanel", this);
    });

    $(".dinner").on("click", function (e) {
        e.preventDefault();
        show_feed(".dPanel", this);
    });
});

function load_select_feed(panelSelector, words) {
    var allEntries = $(".panel.entry", $(".allFeedsPanel")).toArray();
    allEntries.forEach(function (entry) {
        var link = $(entry).find(".entryLink");

        $.embedly.extract(link.href, { key: '968ebde32bab42d7b5e679ecb09d0560' }).progress(function (obj) {
            obj.keywords = obj.keywords.slice(0, 5);
            var words = obj.keywords.toArray();
            words.forEach(function (word) {
                if (words.indexOf(word.name) >= 0) {
                    add_entry_to_panel(panelSelector, entry);
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

function show_feed(selector, highlightButton) {
    unselect_all_buttons();
    select_button(highlightButton);

    var activePanel = $(".active");
    $(activePanel).removeClass("active").addClass("dormant");
    $(selector).removeClass("dormant").addClass("active");
}

function unselect_all_buttons() {
    var buttons = $(".medium.button").toArray();
    buttons.forEach(function (button) {
        $(button).removeClass("success");
    });
}

function select_button(button) {
    unselect_all_buttons();
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

    feed3.load(function (results) {
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