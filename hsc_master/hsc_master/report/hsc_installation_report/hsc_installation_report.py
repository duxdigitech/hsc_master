# Copyright (c) 2025, Dux_Digitech and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import getdate, flt, formatdate

# Doctype constants (from your ERD)
DT_PD  = "Personal Details"
DT_HD  = "HSC Details"
DT_BZ  = "Block at Zone"
DT_CD  = "Cluster Details"
DT_VD  = "Village Details"
DT_CAC = "Contractor At Cluster"
DT_TC  = "Tap Connection"


# --------------------------- KPI helpers (HTML) ---------------------------

def indian_format(value, decimals=0):
    """Return value as Indian-style string, e.g. 12,34,567.89"""
    try:
        num = round(float(value), decimals)
    except Exception:
        return str(value)
    s = f"{num:.{decimals}f}"
    if "." in s:
        whole, frac = s.split(".")
    else:
        whole, frac = s, ""
    whole = whole.replace(",", "")
    if len(whole) > 3:
        head, tail = whole[:-3], whole[-3:]
        groups = []
        while len(head) > 2:
            groups.insert(0, head[-2:])
            head = head[:-2]
        if head:
            groups.insert(0, head)
        whole = ",".join(groups + [tail])
    return whole if not decimals else f"{whole}.{frac}"

def render_kv_pills(title, items):
    """items: list of (label, value) -> small 'pill' strip HTML."""
    pill_htmls = []
    for lbl, val in items:
        pill_htmls.append(
            f'''<div style="display:flex;align-items:center;gap:6px;
                         padding:6px 10px;border:1px solid var(--border-color,#e5e7eb);
                         background:#fff;border-radius:999px;font-size:12px;">
                    <span style="opacity:.75;">{lbl}</span>
                    <span style="font-weight:700;">{val}</span>
                </div>'''
        )
    return (
        f'''<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.3px;">
                    {title}
                </div>
                {''.join(pill_htmls)}
            </div>'''
    )


# ------------------------------ Report API -------------------------------

def execute(filters=None):
    filters = filters or {}
    cols = get_columns()
    data, stats = get_rows_and_stats(filters)

    # Totals for cards
    total_connections = stats.get("count", 0)
    total_mdpe        = flt(stats.get("mdpe_total", 0), 2)

    # Two big cards (left/right)
    card_left = (
        '<div style="flex:1 1 260px;min-width:260px;max-width:100%;">'
        '<div style="padding:12px 16px;border:1px solid var(--border-color,#e5e7eb);'
        'border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04);">'
        '<div style="font-size:12px;color:#6b7280;letter-spacing:.3px;text-transform:uppercase;">'
        'No. of Connections</div>'
        f'<div style="font-size:24px;font-weight:700;margin-top:4px;">{indian_format(total_connections, 0)}</div>'
        '</div></div>'
    )

    card_right = (
        '<div style="flex:1 1 260px;min-width:260px;max-width:100%;">'
        '<div style="padding:12px 16px;border:1px solid var(--border-color,#e5e7eb);'
        'border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04);">'
        '<div style="font-size:12px;color:#6b7280;letter-spacing:.3px;text-transform:uppercase;">'
        'Total MDPE pipe used (m)</div>'
        f'<div style="font-size:24px;font-weight:700;margin-top:4px;">{indian_format(total_mdpe, 2)}</div>'
        '</div></div>'
    )

    # Optional mini-pills (you can add more later)
    pills = render_kv_pills("Summary", [
        ("Connections", indian_format(total_connections, 0)),
        ("MDPE (m)",    indian_format(total_mdpe, 2)),
    ])

    # Optional date range caption
    start = filters.get("from_date")
    end   = filters.get("to_date")
    date_line = ""
    if start and end:
        date_line = (
            '<div style="margin-top:32px;color:#6b7280;font-size:12px;">'
            f'Date range: <b>{formatdate(start)}</b> to <b>{formatdate(end)}</b>.'
            '</div>'
        )

    # Compose final top message block (HTML)
    message = (
        '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;">'
        f'{card_left}{card_right}'
        '</div>'
        f'{pills}'
        f'{date_line}'
    )

    # Return message as the "report message" pane (HTML)
    return cols, data, message, None, None


# ------------------------------ Columns ---------------------------------

def get_columns():
    return [
        {"label": "Date", "fieldname": "date", "fieldtype": "Date", "width": 95},
        {"label": "Block/Zone", "fieldname": "block_zone", "fieldtype": "Data", "width": 130},
        {"label": "Cluster Name", "fieldname": "cluster_name", "fieldtype": "Data", "width": 130},
        {"label": "Village Name", "fieldname": "village_name", "fieldtype": "Data", "width": 140},

        {"label": "Contractor Name", "fieldname": "contractor_name", "fieldtype": "Data", "width": 160},
        {"label": "Firm Name", "fieldname": "firm_name", "fieldtype": "Data", "width": 160},

        {"label": "Customer Name", "fieldname": "customer_name", "fieldtype": "Data", "width": 160},
        {"label": "Mobile Number", "fieldname": "mobile_number", "fieldtype": "Data", "width": 120},
        {"label": "Customer Survey Number", "fieldname": "customer_survey_number", "fieldtype": "Data", "width": 170},
        {"label": "Aadhaar Number", "fieldname": "aadhar_number", "fieldtype": "Data", "width": 140},
        {"label": "Pipe Number", "fieldname": "pipe_number", "fieldtype": "Data", "width": 120},

        {"label": "Saddle Size", "fieldname": "saddle_size", "fieldtype": "Data", "width": 110},
        {"label": "FCV", "fieldname": "fcv", "fieldtype": "Data", "width": 70},
        {"label": "MFTA", "fieldname": "mfta", "fieldtype": "Data", "width": 80},
        {"label": "Compressible Elbow", "fieldname": "compressible_elbow", "fieldtype": "Data", "width": 160},
        {"label": "PVC Ball Valve", "fieldname": "pvc_ball_valve", "fieldtype": "Data", "width": 130},
        {"label": "MDPE Pipe (m)", "fieldname": "mdpe_pipe_length", "fieldtype": "Float", "precision": 2, "width": 120},
        {"label": "GI Pipe (m)", "fieldname": "gi_pipe", "fieldtype": "Float", "precision": 2, "width": 100},
        {"label": "CC Cutting Length (m)", "fieldname": "cc_cutting_length", "fieldtype": "Float", "precision": 2, "width": 170},
        {"label": "CC Cutting Width (m)", "fieldname": "cc_cutting_width", "fieldtype": "Float", "precision": 2, "width": 165},
        {"label": "CC Cutting Depth (m)", "fieldname": "cc_cutting_depth", "fieldtype": "Float", "precision": 2, "width": 165},

        {"label": "Aadhaar Card Photo", "fieldname": "aadhar_card_photo", "fieldtype": "HTML", "width": 130},
        {"label": "Customer Photo", "fieldname": "customer_photo", "fieldtype": "HTML", "width": 130},
        {"label": "Samagra Id Photo", "fieldname": "samagra_id_photo", "fieldtype": "HTML", "width": 130},
        {"label": "Connection Photo", "fieldname": "connection_photo", "fieldtype": "HTML", "width": 130},
        {"label": "Form Photo", "fieldname": "form_photo", "fieldtype": "HTML", "width": 130},
        {"label": "Tap Connection Photo", "fieldname": "tap_connection_photo", "fieldtype": "HTML", "width": 150},
    ]


# ------------------------------- SQL layer -------------------------------

def field_expr(dt_name, alias, candidates, default_val="0"):
    """Return SQL expr for first existing field from candidates on dt_name."""
    meta = frappe.get_meta(dt_name)
    for f in candidates:
        if meta.has_field(f):
            return f"{alias}.{f}"
    return default_val

def get_rows_and_stats(filters):
    conditions, params = [], {}

    if filters.get("from_date"):
        conditions.append("pd.date >= %(from_date)s")
        params["from_date"] = getdate(filters["from_date"])
    if filters.get("to_date"):
        conditions.append("pd.date <= %(to_date)s")
        params["to_date"] = getdate(filters["to_date"])

    if filters.get("block_zone"):
        conditions.append("pd.display_name = %(block_zone)s")
        params["block_zone"] = filters["block_zone"]
    if filters.get("cluster"):
        conditions.append("pd.cluster_name = %(cluster)s")
        params["cluster"] = filters["cluster"]
    if filters.get("village"):
        conditions.append("pd.village_name = %(village)s")
        params["village"] = filters["village"]
    if filters.get("contractor_firm"):
        conditions.append("pd.contractor_name = %(contractor_firm)s")
        params["contractor_firm"] = filters["contractor_firm"]

    where_sql = "WHERE " + " AND ".join(conditions) if conditions else ""

    # Resolve possible fieldname variants safely
    mfta_sql = field_expr(DT_HD, "hd", ["mfta", "mfi_a"], "NULL")
    mdpe_sql = field_expr(DT_HD, "hd",
                          ["mdpa_pipe_length", "mdpe_pipe_length", "mdpe_pipe", "mdpe_length", "mdpe_pipe_len"], "0")
    gi_sql   = field_expr(DT_HD, "hd", ["gi_pipe", "gi_pipe_length", "gi_length"], "0")
    ccl_sql  = field_expr(DT_HD, "hd", ["cc_cutting_length", "cc_length"], "0")
    ccw_sql  = field_expr(DT_HD, "hd", ["cc_cutting_width", "cc_width"], "0")
    ccd_sql  = field_expr(DT_HD, "hd", ["cc_cutting_depth", "cc_depth"], "0")

    sql = f"""
        SELECT
            pd.date,
            bz.display_name                 AS block_zone,
            cd.cluster_name                 AS cluster_name,
            vd.village_name                 AS village_name,

            cac.contractor_name             AS contractor_name,
            cac.firm_name                   AS firm_name,

            pd.customer_name,
            pd.mobile_number,
            pd.customer_survey_number,
            pd.aadhar_number,
            pd.pipe_number,

            hd.saddle_size,
            hd.fcv,
            {mfta_sql}                      AS mfta,
            hd.compressible_elbow,
            hd.pvc_ball_valve,
            COALESCE({mdpe_sql}, 0)         AS mdpe_pipe_length,
            COALESCE({gi_sql}, 0)           AS gi_pipe,
            COALESCE({ccl_sql}, 0)          AS cc_cutting_length,
            COALESCE({ccw_sql}, 0)          AS cc_cutting_width,
            COALESCE({ccd_sql}, 0)          AS cc_cutting_depth,

            pd.aadhar_card_photo,
            pd.customer_photo,
            pd.samagra_id_photo,
            hd.connection_photo,
            hd.form_photo,
            tc.tap_connection_photo

        FROM `tab{DT_PD}`  pd
        LEFT JOIN `tab{DT_HD}`  hd  ON hd.all_details = pd.name
        LEFT JOIN `tab{DT_CAC}` cac ON pd.contractor_name = cac.name
        LEFT JOIN `tab{DT_VD}`  vd  ON pd.village_name    = vd.name
        LEFT JOIN `tab{DT_CD}`  cd  ON pd.cluster_name    = cd.name
        LEFT JOIN `tab{DT_BZ}`  bz  ON pd.display_name    = bz.name
        LEFT JOIN `tab{DT_TC}`  tc  ON tc.all_items       = hd.name
        {where_sql}
        ORDER BY pd.date ASC, pd.name ASC
    """

    rows = frappe.db.sql(sql, params, as_dict=True)

    # Render small thumbnails as clickable links
    for r in rows:
        for key in ("aadhar_card_photo", "customer_photo", "samagra_id_photo",
                    "connection_photo", "form_photo", "tap_connection_photo"):
            r[key] = image_thumb_html(r.get(key))

    stats = {
        "count": len(rows),
        "mdpe_total": sum(flt(r.get("mdpe_pipe_length") or 0) for r in rows),
    }
    return rows, stats


def image_thumb_html(path):
    if not path:
        return ""
    url = frappe.utils.get_url(path)
    return f'<a href="{url}" target="_blank"><img src="{url}" style="height:32px;border-radius:4px"/></a>'
