frappe.query_reports["Purchase Register Report"] = {
    filters: [],
    formatter: function(value,row,column,data,default_formatter){
        return default_formatter(value,row,column,data);
    }
};

// Global function to show image in popup/modal
window.showMaterialImage = function(url){
    if(!url) return;

    let d = new frappe.ui.Dialog({
        title: 'Material Image',
        fields: [
            {fieldtype:'HTML', fieldname:'img_html'}
        ],
        primary_action_label: 'Close',
        primary_action: function() { d.hide(); }
    });

    d.fields_dict.img_html.$wrapper.html(
        `<div style="text-align:center;">
            <img src="${url}" style="max-width:90%; max-height:80vh; border-radius:8px;">
        </div>`
    );

    d.show();
};
