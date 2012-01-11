/* ***** BEGIN LICENSE BLOCK *****
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Firefox Muter.
 *
 * The Initial Developer of the Original Code is
 * the Mozilla Online.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Yuan Xulei <xyuan@mozilla.com>
 *  Hector Zhao <bzhao@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
var muterSettings = (function() {
  let jsm = {};
  Components.utils.import("resource://muter/muterUtils.jsm", jsm);
  let {
    muterUtils
  } = jsm;

  let muterSettings = {

    init: function(event) {
      // For firefox 3.6 only
      if (muterUtils.isVersionLessThan("4.0")) {
        let showInAddonBar = document.getElementById("muter-settings-show-in-addon-bar");
        showInAddonBar.hidden = true;
        let switchButtonStype = document.getElementById("muter-settings-switch-button-style");
        switchButtonStype.hidden = true;
      } else {
        let showInStatusBar = document.getElementById("muter-settings-show-in-status-bar");
        showInStatusBar.hidden = true;
      }
    },

    destory: function(event) {},

    saveSettings: function(event) {},

    restoreSettings: function(event) {
      let preferences = document.getElementsByTagName("preference");
      for (let i = 0; i < preferences.length; i++) {
        preferences[i].value = preferences[i].defaultValue;
      }
      // For firefox 3.6 only
      if (muterUtils.isVersionLessThan("4.0")) {
        let showInStatusBarPref = document.getElementById("showInStatusBar");
        showInStatusBarPref.value = true;
      }
    }
  };

  return muterSettings;
})();