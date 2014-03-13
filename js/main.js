var arrayPanels = [];
$(document).ready(function () {

    var feed1 = new google.feeds.Feed("http://rss.allrecipes.com/daily.aspx?hubID=80");
    var feed2 = new google.feeds.Feed("http://www.kraftfoods.com/rss/dinnerRecipes.aspx");
    var feed3 = new google.feeds.Feed("http://www.food.com/rss");

    feed1.setNumEntries(10);
    feed2.setNumEntries(10);
    feed3.setNumEntries(10);

    feed1.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_array_panels(entries);
        }
    });

    feed2.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_array_panels(entries);
        }
    });

    feed3.load(function (results) {
        if (!results.error) {
            var entries = results.feed.entries;
            display_array_panels(entries);
        }
    });
});

function display_array_panels(entries) {
    entries.forEach(function (entry) {
        var entryTemplate = $(".entry", $(".templates")).clone();
        var title = entryTemplate.find(".entryTitle");
        var pubDate = entryTemplate.find(".entryDate");
        var content = entryTemplate.find(".entryContent");

        title.text(entry.title);
        pubDate.text(entry.publishedDate);
        content.text(entry.contentSnippet);

        $(".feedsPanel").append(entryTemplate);
    });
}