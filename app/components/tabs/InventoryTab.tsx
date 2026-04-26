'use client';

import { Character } from '../../types/character';

export interface InventoryTabProps {
  character: Character;
  isDarkMode: boolean;
  encumbrance: { openSlots: number; maxSlots: number; yourBulk: number };
  getModifier: (score: number) => number;
  purse: Record<string, { amount: number; value: number }>;
  setPurse: React.Dispatch<React.SetStateAction<any>>;
  calculatePurseBulk: () => number;
  calculateTotalValue: () => number;
  rationBox: { boxes: number; rations: number; totalBulk: number };
  setRationBox: React.Dispatch<React.SetStateAction<{ boxes: number; rations: number; totalBulk: number }>>;
  waterskinBox: { skins: number; rations: number; totalBulk: number };
  setWaterskinBox: React.Dispatch<React.SetStateAction<{ skins: number; rations: number; totalBulk: number }>>;
  magicalContainers: any;
  setMagicalContainers: React.Dispatch<React.SetStateAction<any>>;
  purchaseCalculator: any;
  setPurchaseCalculator: React.Dispatch<React.SetStateAction<any>>;
  handlePurchaseCalculation: () => void;
  equippedItems: any[];
  setEquippedItems: React.Dispatch<React.SetStateAction<any[]>>;
  addEquippedItem: () => void;
  removeEquippedItem: () => void;
  syncEquippedItemToSystems: (item: any, index: number) => void;
  inventoryItems: any[];
  setInventoryItems: React.Dispatch<React.SetStateAction<any[]>>;
  addInventoryItem: () => void;
  removeInventoryItem: () => void;
  externalStorage: any[];
  setExternalStorage: React.Dispatch<React.SetStateAction<any[]>>;
  addExternalStorageItem: () => void;
  removeExternalStorageItem: () => void;
  attunedItems: any[];
  setAttunedItems: React.Dispatch<React.SetStateAction<any[]>>;
  unlockAttunementSlot: (slot: number) => void;
  itemTypes: string[];
  carryingSize: string;
}

export default function InventoryTab({
  character,
  isDarkMode,
  encumbrance,
  getModifier,
  purse,
  setPurse,
  calculatePurseBulk,
  calculateTotalValue,
  rationBox,
  setRationBox,
  waterskinBox,
  setWaterskinBox,
  magicalContainers,
  setMagicalContainers,
  purchaseCalculator,
  setPurchaseCalculator,
  handlePurchaseCalculation,
  equippedItems,
  setEquippedItems,
  addEquippedItem,
  removeEquippedItem,
  syncEquippedItemToSystems,
  inventoryItems,
  setInventoryItems,
  addInventoryItem,
  removeInventoryItem,
  externalStorage,
  setExternalStorage,
  addExternalStorageItem,
  removeExternalStorageItem,
  attunedItems,
  setAttunedItems,
  unlockAttunementSlot,
  itemTypes,
  carryingSize,
}: InventoryTabProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Top 5 Boxes */}
      <div className="grid grid-cols-5 gap-4">
        {/* 1. Survival Guide & Encumbrance Column */}
        <div className="space-y-4">
          <div
            className={`p-2 rounded-lg border shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Survival Guide
              </div>
              <div className="text-right">
                <a
                  href="https://docs.google.com/spreadsheets/d/1gMKYyf5Z2LdGhP4zDMvolMItEbtA_w6pSNoHvhgl-fY/edit?gid=1041257008#gid=1041257008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center px-3 py-2 rounded-lg border transition-all duration-200 text-2xl ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 border-orange-500 shadow-md hover:shadow-orange-500/30'
                      : 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-orange-400 shadow-md hover:shadow-orange-400/30'
                  }`}
                >
                  📖
                </a>
              </div>
            </div>
          </div>

          {/* Encumbrance Box */}
          <div
            className={`p-2 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="grid grid-cols-3 gap-1 text-center text-sm mb-2">
              <div>
                <div className={`text-[10px] mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Open Slots</div>
                <div
                  className={`w-full text-center text-lg font-bold border rounded px-1 py-1 text-white bg-gray-700 ${
                    isDarkMode ? 'border-green-400' : 'border-green-400'
                  }`}
                >
                  {encumbrance.openSlots}
                </div>
              </div>
              <div>
                <div className={`text-[10px] mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Max Slots</div>
                <div
                  className={`w-full text-center text-lg font-bold border rounded px-1 py-1 text-white bg-gray-700 cursor-help ${
                    isDarkMode ? 'border-orange-400' : 'border-orange-400'
                  }`}
                  title={`${carryingSize} size (${
                    carryingSize === 'Tiny'
                      ? '6'
                      : carryingSize === 'Small'
                        ? '14'
                        : carryingSize === 'Medium'
                          ? '18'
                          : carryingSize === 'Large'
                            ? '22'
                            : carryingSize === 'Huge'
                              ? '30'
                              : '46'
                  }) + STR modifier (${getModifier(character.abilityScores.strength) >= 0 ? '+' : ''}${getModifier(character.abilityScores.strength)}) = ${encumbrance.maxSlots}`}
                >
                  {encumbrance.maxSlots}
                </div>
              </div>
              <div>
                <div className={`text-[10px] mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Bulk</div>
                <div
                  className={`w-full text-center text-lg font-bold border rounded px-1 py-1 text-white bg-gray-700 ${
                    isDarkMode ? 'border-blue-400' : 'border-blue-400'
                  }`}
                >
                  {encumbrance.yourBulk}
                </div>
              </div>
            </div>
            <div className="text-center pb-8">
              <div className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Capacity:</div>
              {/* Health Bar Style Display */}
              <div className="w-full bg-gray-600 rounded-full h-3 mb-1">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    encumbrance.openSlots <= 0
                      ? 'bg-red-500'
                      : encumbrance.openSlots / encumbrance.maxSlots > 0.5
                        ? 'bg-green-500'
                        : encumbrance.openSlots / encumbrance.maxSlots > 0.2
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, (encumbrance.openSlots / encumbrance.maxSlots) * 100))}%`,
                  }}
                />
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                {encumbrance.openSlots >= 0
                  ? `${Math.round((encumbrance.openSlots / encumbrance.maxSlots) * 100)}%`
                  : `${Math.abs(encumbrance.openSlots)} over capacity (${encumbrance.yourBulk}/${encumbrance.maxSlots + Math.floor(encumbrance.maxSlots / 2)} max)`}
              </div>
              <div className="text-center">
                {encumbrance.openSlots >= 0 ? (
                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Unencumbered
                  </div>
                ) : encumbrance.yourBulk <= encumbrance.maxSlots + Math.floor(encumbrance.maxSlots / 2) ? (
                  <div>
                    <div
                      className={`text-sm font-bold cursor-help ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                      title="You have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution."
                    >
                      Encumbered!
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Speed halved, disadvantage on STR/DEX/CON
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`text-sm font-bold cursor-help ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                      title="You have exceeded maximum carrying capacity!"
                    >
                      ⚠ OVERLOADED! ⚠
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>
                      Exceeded max capacity!
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h3 className="text-sm font-bold text-gray-400">Encumbrance</h3>
            </div>
          </div>
        </div>

        {/* 3. Purse Box */}
        <div
          className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-400'}`}>
                  <th className={`text-left py-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Coin</th>
                  <th className={`text-center py-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Amount</th>
                  <th className={`text-center py-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Value (SP)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(purse).map(([coinType, data]) => (
                  <tr key={coinType} className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-400'}`}>
                    <td className={`py-1 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {coinType.charAt(0).toUpperCase()}P
                    </td>
                    <td className="py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={data.amount || ''}
                        onChange={(e) =>
                          setPurse({
                            ...purse,
                            [coinType]: { ...data, amount: parseInt(e.target.value) || 0 },
                          })
                        }
                        className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-1 text-center">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={(data.amount * data.value).toFixed(2)}
                        onChange={(e) => {
                          const spValue = parseFloat(e.target.value) || 0;
                          const newAmount = spValue / data.value;
                          setPurse({
                            ...purse,
                            [coinType]: { ...data, amount: Math.round(newAmount * 100) / 100 },
                          });
                        }}
                        className={`w-16 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-center pb-8">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Coins: {Object.values(purse).reduce((sum, coin) => sum + coin.amount, 0)}
              {Object.values(purse).reduce((sum, coin) => sum + coin.amount, 0) > 100 && (
                <span className="text-yellow-500 font-bold ml-1">⚠ Over 100 coin limit!</span>
              )}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Bulk = {calculatePurseBulk()}
            </div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} mt-2`}>
              Total = {calculateTotalValue().toFixed(1)} SP
            </div>
          </div>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <h3 className="text-sm font-bold text-gray-400">Purse</h3>
          </div>
        </div>

        {/* 4. Ration Box */}
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="space-y-2 pb-8">
              <div
                className={`grid grid-cols-3 gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}
              >
                <div># of Boxes</div>
                <div># of Rations</div>
                <div>Total Bulk</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="number"
                  min="0"
                  value={rationBox.boxes || ''}
                  onChange={(e) => {
                    const boxes = parseInt(e.target.value) || 0;
                    const rations = rationBox.rations;
                    let totalBulk = 0;

                    if (boxes < 1) {
                      totalBulk = 0;
                    } else if (rations * 0.2 < 1) {
                      totalBulk = Math.floor(boxes - 1);
                    } else if (rations * 0.2 > boxes) {
                      totalBulk = boxes > 0 ? Math.floor(rations * 0.2 - 1) : Math.floor(boxes - 1);
                    } else {
                      totalBulk = Math.floor(boxes - 1);
                    }

                    setRationBox({ ...rationBox, boxes, totalBulk });
                  }}
                  className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                />
                <input
                  type="number"
                  min="0"
                  value={rationBox.rations || ''}
                  onChange={(e) => {
                    const rations = parseInt(e.target.value) || 0;
                    const boxes = rationBox.boxes;
                    let totalBulk = 0;

                    if (boxes < 1) {
                      totalBulk = 0;
                    } else if (rations * 0.2 < 1) {
                      totalBulk = Math.floor(boxes - 1);
                    } else if (rations * 0.2 > boxes) {
                      totalBulk = boxes > 0 ? Math.floor(rations * 0.2 - 1) : Math.floor(boxes - 1);
                    } else {
                      totalBulk = Math.floor(boxes - 1);
                    }

                    setRationBox({ ...rationBox, rations, totalBulk });
                  }}
                  className={`w-full text-center text-xs border-2 rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    rationBox.rations > rationBox.boxes * 5
                      ? 'bg-red-900/20 border-red-500 text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                      : isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                  title={
                    rationBox.rations > rationBox.boxes * 5 ? `⚠️ Exceeds capacity! Max: ${rationBox.boxes * 5}` : ''
                  }
                />
                <input
                  type="number"
                  min="0"
                  value={rationBox.totalBulk || ''}
                  readOnly
                  className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-not-allowed ${
                    isDarkMode
                      ? 'bg-slate-600 border-slate-500 text-gray-300'
                      : 'bg-gray-200 border-gray-400 text-gray-700'
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h3 className="text-sm font-bold text-gray-400">Ration Box</h3>
            </div>
          </div>

          {/* 5. Waterskin Box (beneath Ration Box) */}
          <div
            className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="space-y-2 pb-8">
              <div
                className={`grid grid-cols-3 gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}
              >
                <div># of Skins</div>
                <div># of Rations</div>
                <div>Total Bulk</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="number"
                  min="0"
                  value={waterskinBox.skins || ''}
                  onChange={(e) => {
                    const skins = parseInt(e.target.value) || 0;
                    const rations = waterskinBox.rations;
                    let totalBulk = 0;

                    if (skins < 1) {
                      totalBulk = 0;
                    } else if (rations * 0.2 < 1) {
                      totalBulk = Math.floor(skins - 1);
                    } else if (rations * 0.2 > skins) {
                      totalBulk = skins > 0 ? Math.floor(rations * 0.2 - 1) : Math.floor(skins - 1);
                    } else {
                      totalBulk = Math.floor(skins - 1);
                    }

                    setWaterskinBox({ ...waterskinBox, skins, totalBulk });
                  }}
                  className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                />
                <input
                  type="number"
                  min="0"
                  value={waterskinBox.rations || ''}
                  onChange={(e) => {
                    const rations = parseInt(e.target.value) || 0;
                    const skins = waterskinBox.skins;
                    let totalBulk = 0;

                    if (skins < 1) {
                      totalBulk = 0;
                    } else if (rations * 0.2 < 1) {
                      totalBulk = Math.floor(skins - 1);
                    } else if (rations * 0.2 > skins) {
                      totalBulk = skins > 0 ? Math.floor(rations * 0.2 - 1) : Math.floor(skins - 1);
                    } else {
                      totalBulk = Math.floor(skins - 1);
                    }

                    setWaterskinBox({ ...waterskinBox, rations, totalBulk });
                  }}
                  className={`w-full text-center text-xs border-2 rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    waterskinBox.rations > waterskinBox.skins * 5
                      ? 'bg-red-900/20 border-red-500 text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                      : isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                  title={
                    waterskinBox.rations > waterskinBox.skins * 5
                      ? `⚠️ Exceeds capacity! Max: ${waterskinBox.skins * 5}`
                      : ''
                  }
                />
                <input
                  type="number"
                  min="0"
                  value={waterskinBox.totalBulk || ''}
                  readOnly
                  className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-not-allowed ${
                    isDarkMode
                      ? 'bg-slate-600 border-slate-500 text-gray-300'
                      : 'bg-gray-200 border-gray-400 text-gray-700'
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h3 className="text-sm font-bold text-gray-400">Waterskin</h3>
            </div>
          </div>
        </div>

        {/* 6. Magical Containers Box */}
        <div
          className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-1">Type</th>
                  <th className="text-center py-1"># Owned</th>
                  <th className="text-center py-1">Slots</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-600">
                  <td className="py-1 text-left">Bag of Holding</td>
                  <td className="py-1 text-center">
                    <input
                      type="text"
                      value={magicalContainers.bagOfHolding.owned}
                      onChange={(e) =>
                        setMagicalContainers({
                          ...magicalContainers,
                          bagOfHolding: { ...magicalContainers.bagOfHolding, owned: e.target.value },
                        })
                      }
                      className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                    />
                  </td>
                  <td className="py-1 text-center">{magicalContainers.bagOfHolding.slots}</td>
                </tr>
                <tr className="border-b border-slate-600">
                  <td className="py-1 text-left">Portable Hole</td>
                  <td className="py-1 text-center">
                    <input
                      type="text"
                      value={magicalContainers.portableHole.owned}
                      onChange={(e) =>
                        setMagicalContainers({
                          ...magicalContainers,
                          portableHole: { ...magicalContainers.portableHole, owned: e.target.value },
                        })
                      }
                      className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                    />
                  </td>
                  <td className="py-1 text-center">{magicalContainers.portableHole.slots}</td>
                </tr>
                <tr className="border-b border-slate-600">
                  <td className="py-1 text-left">Handy Haversack</td>
                  <td className="py-1 text-center">
                    <input
                      type="text"
                      value={magicalContainers.handyHaversack.owned}
                      onChange={(e) =>
                        setMagicalContainers({
                          ...magicalContainers,
                          handyHaversack: { ...magicalContainers.handyHaversack, owned: e.target.value },
                        })
                      }
                      className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                    />
                  </td>
                  <td className="py-1 text-center">{magicalContainers.handyHaversack.slots}</td>
                </tr>
                <tr className="border-b border-slate-600">
                  <td className="py-1 text-left">Quiver of Ehlonna</td>
                  <td className="py-1 text-center">
                    <input
                      type="text"
                      value={magicalContainers.quiverOfEhlonna.owned}
                      onChange={(e) =>
                        setMagicalContainers({
                          ...magicalContainers,
                          quiverOfEhlonna: { ...magicalContainers.quiverOfEhlonna, owned: e.target.value },
                        })
                      }
                      className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                    />
                  </td>
                  <td className="py-1 text-center">{magicalContainers.quiverOfEhlonna.slots}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <h3 className="text-sm font-bold text-gray-400">Magical Containers</h3>
          </div>
        </div>

        {/* 7. Purchase Calculator Box */}
        <div
          className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-1">Coin</th>
                  <th className="text-center py-1">Purchase</th>
                  <th className="text-center py-1">After</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(purchaseCalculator).map(([coinType, data]: [string, any]) => (
                  <tr key={coinType} className="border-b border-slate-600">
                    <td className="py-1 text-left capitalize">
                      {coinType} ({coinType.charAt(0).toUpperCase()}P)
                    </td>
                    <td className="py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={data.purchase || ''}
                        onChange={(e) =>
                          setPurchaseCalculator({
                            ...purchaseCalculator,
                            [coinType]: { ...data, purchase: parseInt(e.target.value) || 0 },
                          })
                        }
                        className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-1 text-center text-gray-300">{data.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handlePurchaseCalculation}
            className="w-full mt-3 mb-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
          >
            Calculate
          </button>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <h3 className="text-sm font-bold text-gray-400">Purchase Calculator</h3>
          </div>
        </div>
      </div>

      {/* Equipment Sections - 2 Column Layout */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1.15fr' }}>
        {/* Left Column: Equipped Items + External Storage + Attuned Items */}
        <div className="space-y-6">
          {/* 1. Equipped Items */}
          <div
            className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-1">Type</th>
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1">Bonus</th>
                    <th className="text-center py-1">Range</th>
                    <th className="text-center py-1">Notches</th>
                    <th className="text-center py-1">SP</th>
                    <th className="text-center py-1">Bulk</th>
                    <th className="text-center py-1">Att?</th>
                  </tr>
                </thead>
                <tbody>
                  {equippedItems.map((equippedItem, index) => (
                    <tr key={index} className="border-b border-slate-600">
                      <td className="py-1">
                        <select
                          value={equippedItem.type}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].type = e.target.value;
                            setEquippedItems(newItems);
                            // Trigger sync when type changes
                            syncEquippedItemToSystems(newItems[index], index);
                          }}
                          className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="">-</option>
                          {itemTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1">
                        <input
                          type="text"
                          value={equippedItem.item}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].item = e.target.value;
                            setEquippedItems(newItems);
                            // Trigger sync when item name changes
                            syncEquippedItemToSystems(newItems[index], index);
                          }}
                          className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="text"
                          value={equippedItem.itemBonus}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].itemBonus = e.target.value;
                            setEquippedItems(newItems);
                            // Trigger sync when bonus changes
                            syncEquippedItemToSystems(newItems[index], index);
                          }}
                          className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="text"
                          value={equippedItem.range}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].range = e.target.value;
                            setEquippedItems(newItems);
                          }}
                          className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="text"
                          value={equippedItem.notches}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].notches = e.target.value;
                            setEquippedItems(newItems);
                            // Trigger sync when notches change
                            syncEquippedItemToSystems(newItems[index], index);
                          }}
                          className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={equippedItem.valueSP || ''}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].valueSP = parseFloat(e.target.value) || 0;
                            setEquippedItems(newItems);
                          }}
                          className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={equippedItem.bulk || ''}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].bulk = parseFloat(e.target.value) || 0;
                            setEquippedItems(newItems);
                          }}
                          className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <input
                          id={`reqAtt-${index}`}
                          type="checkbox"
                          checked={equippedItem.reqAtt}
                          onChange={(e) => {
                            const newItems = [...equippedItems];
                            newItems[index].reqAtt = e.target.checked;
                            setEquippedItems(newItems);
                          }}
                          className="form-checkbox h-3 w-3 text-amber-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 mt-2 mb-8">
              <button
                onClick={addEquippedItem}
                className="w-3/5 py-1 px-3 text-xs rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
              >
                Add Item
              </button>

              <button
                onClick={removeEquippedItem}
                disabled={equippedItems.length <= 1}
                className={`w-2/5 py-1 px-3 text-xs rounded transition-colors ${
                  equippedItems.length <= 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-800 hover:bg-red-900 text-white'
                }`}
                title={equippedItems.length <= 1 ? 'Cannot remove - minimum 1 item required' : 'Remove last item'}
              >
                Remove
              </button>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h3 className="text-sm font-bold text-gray-400">Equipped Items</h3>
            </div>
          </div>

          {/* 2. External Storage */}
          <div
            className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1 w-10">Bulk</th>
                    <th className="text-left py-1">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {externalStorage.map((storageItem, index) => (
                    <tr key={index} className="border-b border-slate-600">
                      <td className="py-1">
                        <input
                          type="text"
                          value={storageItem.item}
                          onChange={(e) => {
                            const newItems = [...externalStorage];
                            newItems[index].item = e.target.value;
                            setExternalStorage(newItems);
                          }}
                          className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={storageItem.bulk || ''}
                          onChange={(e) => {
                            const newItems = [...externalStorage];
                            newItems[index].bulk = parseFloat(e.target.value) || 0;
                            setExternalStorage(newItems);
                          }}
                          className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="text"
                          value={storageItem.location}
                          onChange={(e) => {
                            const newItems = [...externalStorage];
                            newItems[index].location = e.target.value;
                            setExternalStorage(newItems);
                          }}
                          className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 mt-2 mb-8">
              <button
                onClick={addExternalStorageItem}
                className="w-3/5 py-1 px-3 text-xs rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
              >
                Add Item
              </button>

              <button
                onClick={removeExternalStorageItem}
                disabled={externalStorage.length <= 1}
                className={`w-2/5 py-1 px-3 text-xs rounded transition-colors ${
                  externalStorage.length <= 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-800 hover:bg-red-900 text-white'
                }`}
                title={externalStorage.length <= 1 ? 'Cannot remove - minimum 1 item required' : 'Remove last item'}
              >
                Remove
              </button>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h3 className="text-sm font-bold text-gray-400">External Storage</h3>
            </div>
          </div>

          {/* 3. Attuned Items */}
          <div
            className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-center py-1">Slot</th>
                    <th className="text-left py-1">Item</th>
                    <th className="text-left py-1">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {attunedItems.map((attunedItem) => (
                    <tr key={attunedItem.slot} className="border-b border-slate-600">
                      <td className="py-1 text-center font-medium">{attunedItem.slot}</td>
                      <td className="py-1">
                        {attunedItem.slot <= 3 || attunedItem.unlocked ? (
                          <input
                            type="text"
                            value={attunedItem.item}
                            onChange={(e) => {
                              const newItems = attunedItems.map((slot) =>
                                slot.slot === attunedItem.slot ? { ...slot, item: e.target.value } : slot,
                              );
                              setAttunedItems(newItems);
                            }}
                            className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                                : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Locked</span>
                        )}
                      </td>
                      <td className="py-1">
                        {attunedItem.slot <= 3 || attunedItem.unlocked ? (
                          <input
                            type="text"
                            value={attunedItem.details}
                            onChange={(e) => {
                              const newItems = attunedItems.map((slot) =>
                                slot.slot === attunedItem.slot ? { ...slot, details: e.target.value } : slot,
                              );
                              setAttunedItems(newItems);
                            }}
                            className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                                : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 mb-8 space-x-2">
              <button
                onClick={() => unlockAttunementSlot(4)}
                disabled={attunedItems.find((slot) => slot.slot === 4)?.unlocked}
                className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Unlock Slot 4?
              </button>
              <button
                onClick={() => unlockAttunementSlot(5)}
                disabled={attunedItems.find((slot) => slot.slot === 5)?.unlocked}
                className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Unlock Slot 5?
              </button>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h3 className="text-sm font-bold text-gray-400">Attuned Items</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory */}
        <div
          className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-1 w-32">Item</th>
                  <th className="text-left py-1">Details</th>
                  <th className="text-center py-1 w-8">Amount</th>
                  <th className="text-center py-1 w-10">SP</th>
                  <th className="text-center py-1 w-10">Bulk</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((inventoryItem, index) => (
                  <tr key={index} className="border-b border-slate-600">
                    <td className="py-1">
                      <input
                        type="text"
                        value={inventoryItem.item}
                        onChange={(e) => {
                          const newItems = [...inventoryItems];
                          newItems[index].item = e.target.value;
                          setInventoryItems(newItems);
                        }}
                        className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </td>
                    <td className="py-1">
                      <input
                        type="text"
                        value={inventoryItem.details}
                        onChange={(e) => {
                          const newItems = [...inventoryItems];
                          newItems[index].details = e.target.value;
                          setInventoryItems(newItems);
                        }}
                        className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Details"
                      />
                    </td>
                    <td className="py-1">
                      <input
                        type="number"
                        min="0"
                        value={inventoryItem.amount || ''}
                        onChange={(e) => {
                          const newItems = [...inventoryItems];
                          newItems[index].amount = parseInt(e.target.value) || 0;
                          setInventoryItems(newItems);
                        }}
                        onFocus={(e) => e.target.select()}
                        className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-1">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={inventoryItem.valueSP || ''}
                        onChange={(e) => {
                          const newItems = [...inventoryItems];
                          newItems[index].valueSP = parseFloat(e.target.value) || 0;
                          setInventoryItems(newItems);
                        }}
                        className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-1">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={inventoryItem.bulk || ''}
                        onChange={(e) => {
                          const newItems = [...inventoryItems];
                          newItems[index].bulk = parseFloat(e.target.value) || 0;
                          setInventoryItems(newItems);
                        }}
                        onFocus={(e) => e.target.select()}
                        className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mt-2 mb-8">
            <button
              onClick={addInventoryItem}
              className="w-3/5 py-1 px-3 text-xs rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
            >
              Add Item
            </button>

            <button
              onClick={removeInventoryItem}
              disabled={inventoryItems.length <= 1}
              className={`w-2/5 py-1 px-3 text-xs rounded transition-colors ${
                inventoryItems.length <= 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-800 hover:bg-red-900 text-white'
              }`}
              title={inventoryItems.length <= 1 ? 'Cannot remove - minimum 1 item required' : 'Remove last item'}
            >
              Remove
            </button>
          </div>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <h3 className="text-sm font-bold text-gray-400">Inventory</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
