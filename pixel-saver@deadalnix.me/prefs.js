'use strict';

const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
}

function buildPrefsWidget() {

    this.settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.pixel-saver');

    let prefsWidget = new Gtk.Grid({
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });

    const model = new Gtk.ListStore();
    model.set_column_types([GObject.TYPE_STRING, GObject.TYPE_STRING]);

    const comboBox = new Gtk.ComboBox({ model: model });
    const cellRenderer = new Gtk.CellRendererText();
    comboBox.pack_start(cellRenderer, true);
    comboBox.add_attribute(cellRenderer, 'text', 1);

    const buttonPanelPositionOptions = {
        'left': 'Left',
        'right': 'Right',
        'center': 'Center'
    };

    for (let panelPositionKey in buttonPanelPositionOptions) {
        model.set(
            model.append(),
            [0, 1],
            [panelPositionKey, buttonPanelPositionOptions[panelPositionKey]]);
    }

    comboBox
        .set_active(Object.keys(buttonPanelPositionOptions)
        .indexOf(this.settings.get_string('button-panel-position')));

    comboBox.connect('changed', () => {
        const [success, iter] = comboBox.get_active_iter();
        if (!success) return;

        this.settings.set_string('button-panel-position', model.get_value(iter, 0));
    });

    const label = new Gtk.Label({
        label: 'Button panel position',
        halign : Gtk.Align.END
    });
    prefsWidget.attach(label, 0, 1, 1, 1);
    prefsWidget.attach(comboBox, 1, 1, 1, 1);

    return prefsWidget;
}