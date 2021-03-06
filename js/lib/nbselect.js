try {
    if (!Nabu) throw "Nabu Manager not loaded";
} catch (e) {
    throw "Nabu Manager not loaded";
}

if (typeof Nabu.UI === 'undefined') {
    Nabu.UI = function() {};
}

Nabu.UI.Select = function(object, params) {
    this.container = object;
    this.input = $(object).find('input[type="hidden"]');
    this.caption = $(object).find('button:first-child').get(0);
    this.params = params;

    this.init();
};

Nabu.UI.Select.prototype = {
    init: function()
    {
        var Self = this;
        if (this.input.length === 1) {
            $(this.container).find('.dropdown-menu [data-id]').off('click').on('click', function(e) {
                Self.selectItem($(this));
                var id = $(this).data('id');
                $(Self.container).trigger('change.select.nabu', {option: id});
                e.preventDefault();
            });
        }

        if (this.input.length > 0) {
            var id = this.input.val();
            if (id.length > 0) {
                var item = $(this.container).find('.dropdown-menu [data-id="' + id + '"]');
                if (item.length > 0) {
                    this.selectItem(item);
                    $(this.container).trigger('init.select.nabu', {option: id});
                } else {
                    this.clearSelection();
                }
            } else {
                this.clearSelection();
            }
        } else {
            this.clearSelection();
        }
    },

    selectItem: function(item)
    {
        var id = item.data('id');
        this.input.val(id);
        var mask = $(this.container).data('captionMask');
        var itemObj = item.get(0);
        var content = (itemObj.tagName.toLowerCase() == 'a' ? item.get(0).innerHTML : item.find('a').get(0).innerHTML);
        this.caption.innerHTML = (typeof mask == 'undefined' ? content : $.sprintf(mask, content));
        $(item).siblings('.active').removeClass('active');
        $(item).addClass('active');
        var form = $(item).closest('form');
        if (form.length > 0 && typeof form.get(0).nabuForm != 'undefined') {
            form.get(0).nabuForm.evaluateField(this.input.attr('name'));
        }
    },

    clearSelection: function()
    {
        var prior = this.input.length > 0 ? this.input.length : null;
        var prev_val = this.input.val();
        this.input.removeAttr('value');
        var html = $(this.container).data('captionDefault');
        this.caption.innerText = (typeof html == 'undefined' ? '' : html);
        $(this.container).find('.dropdown-menu .active').removeClass('active');
        if (this.input.length > 0 && prev_val.length > 0) {
            $(this.container).trigger('clear.select.nabu', { prior_value: prior });
        }
    }
};

nabu.registerLibrary('Select', ['Event', 'Ajax']);
