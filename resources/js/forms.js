require("chosen-js");
import flatpickr from "flatpickr";
import tippy from "tippy.js";

// build flatpickr objects
$.buildFlatpickr = function () {
    const dateTimePickerOptions = {
        allowInput: true,
        altFormat: datetime_format,
        dateFormat: "Y-m-d H:i:s",
        enableTime: true,
        time_24hr: true,
        altInput: true,
    };

    const timePickerOptions = {
        altInput: true,
        allowInput: true,
        enableTime: true,
        noCalendar: true,
        altFormat: time_format,
        dateFormat: "H:i:s",
        time_24hr: true,
    };

    const datePickerOptions = {
        allowInput: true,
        altInput: true,
        altFormat: date_format,
        dateFormat: "Y-m-d",
    };

    const birthdatePickerOptions = {
        allowInput: true,
        altInput: true,
        altFormat: date_format,
        dateFormat: "Y-m-d",
        defaultDate: new Date().setFullYear(new Date().getFullYear() - 18),
        monthSelectorType: "dropdown",
    };

    // find and build flatpickr objects by class
    $(document)
        .find(".datetimepicker")
        .each(function () {
            var minDate = $(this).attr("data-min-date");
            var maxDate = $(this).attr("data-max-date");

            if (minDate) {
                dateTimePickerOptions.minDate = minDate;
            }
            if (maxDate) {
                dateTimePickerOptions.maxDate = maxDate;
            }
            flatpickr(this, dateTimePickerOptions);
        });

    $(document)
        .find(".timepicker")
        .each(function () {
            var minDate = $(this).attr("data-min-date");
            var maxDate = $(this).attr("data-max-date");

            if (minDate) {
                timePickerOptions.minDate = minDate;
            }
            if (maxDate) {
                timePickerOptions.maxDate = maxDate;
            }
            flatpickr(this, timePickerOptions);
        });

    $(document)
        .find(".datepicker")
        .each(function () {
            var minDate = $(this).attr("data-min-date");
            var maxDate = $(this).attr("data-max-date");

            if (minDate) {
                datePickerOptions.minDate = minDate;
            }
            if (maxDate) {
                datePickerOptions.maxDate = maxDate;
            }
            flatpickr(this, datePickerOptions);
        });

    $(document)
        .find(".birthdatepicker")
        .each(function () {
            var minDate = $(this).attr("data-min-date");
            var maxDate = $(this).attr("data-max-date");

            if (minDate) {
                birthdatePickerOptions.minDate = minDate;
            }
            if (maxDate) {
                birthdatePickerOptions.maxDate = maxDate;
            }
            flatpickr(this, birthdatePickerOptions);
        });
};

// build chosen objects
$.buildChosen = function () {
    $("select").chosen({
        disable_search_threshold: 5,
        placeholder_text: choose,
        no_results_text: no_results,
        width: "100%",
    });
};

$("input[type=password]").on("focus", function () {
    $(this).val("");
});

$('input[data-numeric="decimal"]').on("focusout", function () {
    var val = $(this).val();
    if (val != "" && !val.includes(".") && !val.includes(",")) {
        $(this).val(val + ".00");
    }
});

$('input[data-numeric="decimal"]').on("focusout", function () {
    var val = $(this).val();
    if (!val.includes(".") && !val.includes(",")) {
        $(this).val(val + ".00");
    }
});

$('input[data-validation="numeric"]').on("keypress", function (evt) {
    $(this).val(
        $(this)
            .val()
            .replace(/[^0-9\.|\,]/g, "")
    );
    if (evt.which == 44) {
        return true;
    }
    if (
        (evt.which != 46 || $(this).val().indexOf(".") != -1) &&
        (evt.which < 48 || evt.which > 57)
    ) {
        evt.preventDefault();
    }
});

jQuery(function () {
    buildVendors();
});

$.rebuildVendors = function () {
    buildVendors();
};

// use this to build or rebuild chosen and flatpickr and other js form objects
function buildVendors() {
    $.buildChosen();
    $.buildFlatpickr();

    tippy("[data-tippy-content]", {
        allowHTML: true,
    });
}
