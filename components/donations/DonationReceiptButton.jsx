import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const DonationReceiptButton = ({ donation }) => {
  const [generating, setGenerating] = useState(false);

  const escapeHtml = value => {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatAmount = value => {
    return Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = value => {
    if (!value) return '-';

    const date = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatType = value => {
    if (!value || value.toLowerCase() === 'other') {
      return 'General Seva';
    }

    return value
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  const generateReceiptHtml = () => {
    const address = [
      donation?.address,
      donation?.city,
      donation?.state,
      donation?.pincode,
      donation?.country,
    ]
      .filter(Boolean)
      .join(', ');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              background: #f7f0e8;
              font-family: Arial, Helvetica, sans-serif;
              color: #4d2d1a;
            }

            .page {
              padding: 40px;
            }

            .receipt {
              background: #ffffff;
              border-radius: 18px;
              overflow: hidden;
              border: 1px solid #e8d7c7;
            }

            .header {
              background: #5b321f;
              padding: 32px;
              color: #ffffff;
            }

            .brand {
              font-size: 25px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .brand-subtitle {
              color: #ead8c9;
              font-size: 12px;
            }

            .receipt-title {
              margin-top: 25px;
              font-size: 17px;
              font-weight: bold;
            }

            .body {
              padding: 32px;
            }

            .success {
              display: inline-block;
              background: #eaf5eb;
              color: #3f7348;
              padding: 7px 13px;
              border-radius: 30px;
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 22px;
            }

            .amount-label {
              color: #9a7962;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .amount {
              font-size: 35px;
              font-weight: bold;
              margin-top: 5px;
              margin-bottom: 28px;
              color: #4d2d1a;
            }

            .divider {
              border-top: 1px solid #eadfd5;
              margin: 4px 0 24px;
            }

            .section-title {
              font-size: 12px;
              color: #9b7960;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 14px;
              font-weight: bold;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            td {
              padding: 9px 0;
              vertical-align: top;
              font-size: 12px;
              line-height: 18px;
            }

            td:first-child {
              color: #94755f;
              width: 35%;
            }

            td:last-child {
              color: #4d2d1a;
              font-weight: bold;
              text-align: right;
            }

            .transaction {
              background: #faf3ec;
              border-radius: 12px;
              padding: 17px;
              margin-top: 25px;
            }

            .transaction-label {
              color: #9b7960;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .transaction-value {
              font-size: 12px;
              font-weight: bold;
              color: #573722;
              margin-top: 6px;
              word-break: break-all;
            }

            .footer {
              text-align: center;
              padding: 25px 32px 30px;
              color: #9c806c;
              font-size: 10px;
              line-height: 16px;
            }

            .thank-you {
              color: #633b24;
              font-size: 15px;
              font-weight: bold;
              margin-bottom: 7px;
            }
          </style>
        </head>

        <body>
          <div class="page">
            <div class="receipt">

              <div class="header">
                <div class="brand">
                  GIEO GITA
                </div>

                <div class="brand-subtitle">
                  Donation Receipt
                </div>

                <div class="receipt-title">
                  Thank you for your Seva
                </div>
              </div>

              <div class="body">

                <div class="success">
                  PAYMENT COMPLETED
                </div>

                <div class="amount-label">
                  Donation Amount
                </div>

                <div class="amount">
                  ₹${escapeHtml(formatAmount(donation?.amount))}
                </div>

                <div class="divider"></div>

                <div class="section-title">
                  Donation Details
                </div>

                <table>

                  <tr>
                    <td>Donor Name</td>

                    <td>
                      ${escapeHtml(
                        donation?.name || donation?.user_name || '-',
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Email</td>

                    <td>
                      ${escapeHtml(
                        donation?.email || donation?.user_email || '-',
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Phone</td>

                    <td>
                      ${escapeHtml(donation?.phone || '-')}
                    </td>
                  </tr>

                  <tr>
                    <td>Donation For</td>

                    <td>
                      ${escapeHtml(formatType(donation?.type))}
                    </td>
                  </tr>

                  <tr>
                    <td>Donation Date</td>

                    <td>
                      ${escapeHtml(formatDate(donation?.donation_date))}
                    </td>
                  </tr>

                  ${
                    donation?.pan_number
                      ? `
                        <tr>
                          <td>PAN Number</td>

                          <td>
                            ${escapeHtml(donation.pan_number)}
                          </td>
                        </tr>
                      `
                      : ''
                  }

                  ${
                    address
                      ? `
                        <tr>
                          <td>Address</td>

                          <td>
                            ${escapeHtml(address)}
                          </td>
                        </tr>
                      `
                      : ''
                  }

                </table>

                <div class="transaction">

                  <div class="transaction-label">
                    Transaction ID
                  </div>

                  <div class="transaction-value">
                    ${escapeHtml(
                      donation?.transaction_id ||
                        donation?.merchantTxnNo ||
                        '-',
                    )}
                  </div>

                </div>

              </div>

              <div class="footer">

                <div class="thank-you">
                  Thank you for supporting GIEO GITA
                </div>

                This is a computer-generated donation receipt.
                No physical signature is required.

              </div>

            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleGenerateReceipt = async () => {
    if (generating) return;

    try {
      setGenerating(true);

      const html = generateReceiptHtml();

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const sharingAvailable = await Sharing.isAvailableAsync();

      if (!sharingAvailable) {
        Alert.alert(
          'Receipt Generated',
          `Receipt created successfully at:\n${uri}`,
        );

        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Donation Receipt',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.log('Receipt generation error:', error);

      Alert.alert(
        'Unable to Generate Receipt',
        'Something went wrong while generating the donation receipt.',
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, generating && styles.buttonDisabled]}
      onPress={handleGenerateReceipt}
      disabled={generating}
      activeOpacity={0.8}>
      {generating ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name="arrow-down" size={17} color="#FFFFFF" />
        </>
      )}
    </TouchableOpacity>
  );
};

export default DonationReceiptButton;

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderRadius: 17,

    backgroundColor: '#6A3C25',

    alignItems: 'center',
    justifyContent: 'center',

    // marginTop: 10,

    shadowColor: '#5A321F',
    shadowOpacity: 0.14,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  buttonDisabled: {
    opacity: 0.65,
  },
});
