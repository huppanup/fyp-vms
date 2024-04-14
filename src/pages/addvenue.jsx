import React, { useState, useEffect } from "react";
import '../stylesheets/addvenue.css'

export default () => {

  return (
    <>
    <div className="add-container">
        <div className="add-left">
        <div id="add-heading">Create Venue</div>
        <form>
            <div className="input-heading">info.json *</div>
            <div className="add-item">
            <input type="file" id="info.json" accept=".json" />
            </div>
            <div className="input-heading">Constraints</div>
            <div className="add-item">
            <input type="file" id="constraints" accept=".zip" />
            </div>
            <div className="input-heading">Fingerprints</div>
            <div className="add-item">
            <label for="wifi">Wi-Fi</label><input type="file" id="wifi" name="venuefiles" accept=".zip" />
            </div>
            <div className="add-item">
            <label for="magnetic">Magnetic</label><input type="file" id="magnetic" name="venuefiles" accept=".zip" />
            </div>
            <div className="add-item">
            <label for="ble">i-Beacon</label><input type="file" id="ble" name="venuefiles" accept=".zip" />
            </div>
            <div className="input-heading">Maps</div>
            <div className="add-item">
            <input type="file" id="floorplan" name="venuefiles" accept=".zip" />
            </div>
            <div className="add-item">
            <input type="submit" />
            </div>
        </form>
        </div>
        <div className="add-right">
            <div id="add-heading">Venue Details</div>
            Venue Name
            Floors
            Constraints
            transformation
            

        </div>
    </div>
    </>
  );
};
