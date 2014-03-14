var feed1;
var feed2;
var feed3;
var feed4;
var feed5;

// var feed1Entries;
// var feed2Entries;
// var feed3Entries;
// var feed4Entries;
// var feed5Entries;

var allEntries = new Array();
feed1 = new google.feeds.Feed("http://rss.allrecipes.com/daily.aspx?hubID=80");
feed2 = new google.feeds.Feed("http://www.kraftfoods.com/rss/topRatedRecipes.aspx");
feed3 = new google.feeds.Feed("http://www.food.com/rss");
feed4 = new google.feeds.Feed("http://feeds.feedburner.com/elise/simplyrecipes");
feed5 = new google.feeds.Feed("http://www.food.com/rssapi.do?page_type=26&slug=breakfast");

feed1.setNumEntries(5);
feed2.setNumEntries(5);
feed3.setNumEntries(5);
feed4.setNumEntries(5);
feed5.setNumEntries(5);

var breakfast_feed = new Array();
var lunch_feed = new Array();
var dinner_feed = new Array();

load_all_feeds();

window.onload = function () {
    load_panels();
}

function load_panels() {
    allEntries.forEach(function (entry) {
        var feedLink = entry.link;
        $.ajax({
            url: "http://api.embed.ly/1/extract",
            data: {
                key: "968ebde32bab42d7b5e679ecb09d0560",
                url: feedLink,
                words: 15,
                format: "json"
            },
            crossDomain: true,
            dataType: "json",
            type: "GET",
            success: function (data, status, jqXHR) {
                var keywords = data.keywords;
                var title = data.title;

                if (keywords.length > 0 && title) {
                    var words = Array();
                    keywords.forEach(function (word) {
                        words.push(word.name);
                    });

                    try_nlp_search(words, title, entry);
                    try_tag_search(entry);
                    try_title_search(entry);
                }
            }
        });
    });
}

function add_entry_to_feed(entry, feed, panelSelector) {
    if (feed.indexOf(entry) == -1) {
        add_entry_to_panel(panelSelector, entry);
        feed.push(entry);
    }
}

function try_nlp_search(words, title, entry) {
    
    words.forEach(function (word) {
        if (breakfast_words.indexOf(word.toLowerCase()) != -1 || breakfast_words.indexOf(title.toLowerCase()) != -1) 
            add_entry_to_feed(entry, breakfast_feed, ".bPanel");

        if (lunch_words.indexOf(word.toLowerCase()) != -1 || lunch_words.indexOf(title.toLowerCase()) != -1) 
            add_entry_to_feed(entry, lunch_feed, ".lPanel");

        if (dinner_words.indexOf(word.toLowerCase()) != -1 || dinner_words.indexOf(title.toLowerCase()) != -1) 
            add_entry_to_feed(entry, dinner_feed, ".dPanel");
    });
}
function try_tag_search(entry) {
    if (entry.categories.length > 0) {
        var tags = entry.categories;

        tags.forEach(function (tag) {
            if (breakfast_words.indexOf(tag.toLowerCase())) 
                add_entry_to_feed(entry, breakfast_feed, ".bPanel");
            
            if (lunch_words.indexOf(tag.toLowerCase())) 
                add_entry_to_feed(entry, lunch_feed, ".lPanel");

            if (dinner_words.indexOf(tag.toLowerCase()))
                add_entry_to_feed(entry, dinner_feed, ".dPanel");
        });
    }
}

function try_title_search(entry) {
    var titleWords = (entry.title).split(" ");

    titleWords.forEach(function(word) {
        if (breakfast_words.indexOf(word.toLowerCase()) != -1) 
            add_entry_to_feed(entry, breakfast_feed, ".bPanel");

        if (lunch_words.indexOf(word.toLowerCase()) != -1)
            add_entry_to_feed(entry, lunch_feed, ".lPanel");

        if (dinner_words.indexOf(word.toLowerCase()) != -1)
            add_entry_to_feed(entry, dinner_feed, ".dPanel");

    });
}

$(document).ready(function () {

    $(".displayAll").on("click", function (e) {
        e.preventDefault();
        show_feed_panel(".allFeedsPanel", this);
    });

    $(".breakfast").on("click", function (e) {
        e.preventDefault();
        show_feed_panel(".bPanel", this);
    });

    $(".lunch").on("click", function (e) {
        e.preventDefault();
        show_feed_panel(".lPanel", this);
    });

    $(".dinner").on("click", function (e) {
        e.preventDefault();
        show_feed_panel(".dPanel", this);
    });
});

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

function load_all_feeds(callback) {
    feed1.load(function (results) {
        load_complete_action(results);
    });

    feed2.load(function (results) {
        load_complete_action(results);
    });

    feed3.load(function (results) {
        load_complete_action(results);
    });

    feed4.load(function (results) {
        load_complete_action(results);
    });

    feed5.load(function (results) {
        load_complete_action(results);
    });
}

function load_complete_action(results) {
    if (!results.error) {
        var entries = results.feed.entries;
        allEntries = allEntries.concat(entries);
        display_feed_entries(entries);
    } else {
        alert("There was a problem!");
    }
}

function display_feed_entries(entries) {
    entries.forEach(function (entry) {
        add_entry_to_panel(".allFeedsPanel", entry);
    });
}

function show_feed_panel(selector, highlightButton) {
    select_button(highlightButton);

    var activePanel = $(".active");
    $(activePanel).removeClass("active").addClass("dormant");
    $(selector).removeClass("dormant").addClass("active");
}

function select_button(button) {
    var buttons = $(".medium.button").toArray();
    buttons.forEach(function (button) {
        $(button).removeClass("success");
    });
    
    $(button).addClass("success");
}

var breakfast_words = ['breakfast', 'pancakes', 'waffles', 'eggs', 'toast', 'yogurt', 'sausage', 'bacon', 'hash brown'];
var lunch_words = ['lunch', 'quick', 'soup', 'salad', 'sandwich', 'beef', 'chicken', 'pizza'];
var dinner_words = ['dinner', 'soup', 'salad', 'burgers', 'beef', 'chicken', 'fish', 'casserole', 'spaghetti'
,'dessert'];
