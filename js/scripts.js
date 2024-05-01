function digits_float(target){
    let value = target.val().replace(/[^0-9.]/g, '');

    if(parseFloat(value) > 100)
        value = "100";

    if (value.indexOf(".") !== -1)
        value = value.substring(0, value.indexOf(".") + 3);

    target.val(value);
}

function digits_int(target){
    let value = target.val().replace(/[^0-9]/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    target.val(value);
}

function resizeCards(container) {
    let containerWidth = container.width(); // Получаем ширину контейнера
    let cards = container.children(".card"); // Получаем все дочерние элементы с классом "card"
    let cardWidth = cards.first().outerWidth(); // Получаем ширину первой карточки вместе с отступами и рамкой
    let maxCardsPerRow = Math.floor(containerWidth / cardWidth);
    let totalCards = cards.length; // Общее количество карточек

    cards.filter(function() {
        return $(this).children("img, span").length === 0;
    }).remove();

    cards = container.children(".card");
    totalCards = cards.length;

    if (totalCards > 0) {
        let remainder = totalCards % maxCardsPerRow;
        let cardsToAdd = remainder === 0 ? 0 : maxCardsPerRow - remainder;

        for (let i = 0; i < cardsToAdd; i++) {
            container.append("<div class=\"card\" style=\"width:" + (cardWidth) + "px\"></div>");
        }
    }

    cards = container.children(".card");
    totalCards = cards.length;

    let rowsToRemove = [];
    cards.each(function(index) {
        if (index % maxCardsPerRow === 0 && index + maxCardsPerRow <= totalCards) {
            let rowCards = cards.slice(index, index + maxCardsPerRow);
            if (rowCards.filter(function() {
                return $(this).children("img, span").length > 0;
            }).length === 0) {
                rowsToRemove.push(rowCards);
            }
        }
    });

    rowsToRemove.forEach(function(row) {
        row.remove();
    });
}

$(document)
    .ready(function() {
        resizeCards($("#payment_types"));
        resizeCards($("#banks"));

        $(window).resize(function() {
            // resizeCards($("#payment_types"));
            resizeCards($("#banks"));
            resizeCards($("#payment_types"));
        });
    })
    .on("input", "input.integer", (event) => digits_int($(event.currentTarget)))
    .on("input", "input.float", (event) => digits_float($(event.currentTarget)))
    .on("input", "input.integer, input.float", function (event) {
        let element = $(event.currentTarget);

        if(isNaN(Number(element.val().replace(/ /g, 0))))
            element.val(element.val().slice(0, -1));
    })
    .on("click", ".variant", function (event) {
        let element = $(event.currentTarget);
        let target = element.parent().prev();

        target.val(element.data("value"));

        if(target.hasClass("integer"))
            digits_int(target);
    })
    .on("click", ".toggle label", function (event) {
        let element = $(event.currentTarget);

        element.siblings(".selection").animate({
            left: element[0].offsetLeft
        }, 500);
    })
    .on("click", ".add", function (event) {
        let button = $(event.currentTarget);

        $("#" + button.data("type")).show();
    })
    .on("click", "[data-action=\"close\"]", function () {
        $(".popup-block").hide()
    })
    .on("click", "[data-action=\"share\"]", function () {
        $(".share-background").toggle()
    })
    .on("click", ".share-background", function (event) {
        if(event.target !== event.currentTarget)
            return;

        $(".share-background").hide()
    });
