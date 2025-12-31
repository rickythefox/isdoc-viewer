import type React from "react";
import { useTranslation } from "react-i18next";
import type { AccountingParty } from "../types/isdoc";

interface PartyPanelProps {
  party: AccountingParty;
  title: string;
}

export const PartyPanel: React.FC<PartyPanelProps> = ({ party, title }) => {
  const { t } = useTranslation();
  const {
    partyIdentification,
    partyName,
    postalAddress,
    registerIdentification,
    contact,
  } = party.party;

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      {partyName?.name && (
        <div className="font-semibold text-lg mb-2">{partyName.name}</div>
      )}

      {partyIdentification?.id && (
        <div className="text-sm text-gray-600 mb-2">
          {t("parties.ico")}: {partyIdentification.id}
        </div>
      )}

      <div className="text-sm space-y-1 mb-3">
        {postalAddress.streetName && (
          <div>
            {postalAddress.streetName} {postalAddress.buildingNumber}
          </div>
        )}
        {postalAddress.cityName && (
          <div>
            {postalAddress.postalZone && `${postalAddress.postalZone} `}
            {postalAddress.cityName}
          </div>
        )}
        {postalAddress.country?.name && <div>{postalAddress.country.name}</div>}
      </div>

      {registerIdentification?.preformatted && (
        <div className="text-xs text-gray-600 mb-3 border-t pt-2">
          {registerIdentification.preformatted}
        </div>
      )}

      {contact && (
        <div className="text-sm space-y-1 border-t pt-2">
          {contact.name && <div className="font-medium">{contact.name}</div>}
          {contact.telephone && (
            <div>
              {t("parties.tel")}: {contact.telephone}
            </div>
          )}
          {contact.electronicMail && (
            <div>
              {t("parties.email")}: {contact.electronicMail}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
