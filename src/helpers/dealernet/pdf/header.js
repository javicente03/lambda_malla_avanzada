const FormatRut = require("../../../functions/formatRut");

const Header = async (data) => {

    return `<div style="margin: 0 auto">
                    <h3 style="margin: -5px;color: #1f497d; font-size: 20px; text-align:center">
                        <span style="margin: 0 auto; display:block; width:90%">${data.name}</span>
                    </h3>
                    <p style="font-weight: bold; font-size: 12px; text-align: center; color: #1f497d">${FormatRut(data.rut)}</p>
            </div>`;
}

module.exports = Header;