'use client';

import React, { useRef, useState } from 'react';
import styles from './Oven.module.css';
import SponsorPlate from './SponsorPlate';
import OvenChamber from './OvenChamber';
import URLConsole from './URLConsole';
import { PublicBrand } from '@/lib/types';
import BidForm from './BidForm';

const CLAUDE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="248" height="248" viewBox="0 0 248 248" fill="none"><path d="M52.4285 162.873L98.7844 136.879L99.5485 134.602L98.7844 133.334H96.4921L88.7237 132.862L62.2346 132.153L39.3113 131.207L17.0249 130.026L11.4214 128.844L6.2 121.873L6.7094 118.447L11.4214 115.257L18.171 115.847L33.0711 116.911L55.485 118.447L71.6586 119.392L95.728 121.873H99.5485L100.058 120.337L98.7844 119.392L97.7656 118.447L74.5877 102.732L49.4995 86.1905L36.3823 76.62L29.3779 71.7757L25.8121 67.2858L24.2839 57.3608L30.6515 50.2716L39.3113 50.8623L41.4763 51.4531L50.2636 58.1879L68.9842 72.7209L93.4357 90.6804L97.0015 93.6343L98.4374 92.6652L98.6571 91.9801L97.0015 89.2625L83.757 65.2772L69.621 40.8192L63.2534 30.6579L61.5978 24.632C60.9565 22.1032 60.579 20.0111 60.579 17.4246L67.8381 7.49965L71.9133 6.19995L81.7193 7.49965L85.7946 11.0443L91.9074 24.9865L101.714 46.8451L116.996 76.62L121.453 85.4816L123.873 93.6343L124.764 96.1155H126.292V94.6976L127.566 77.9197L129.858 57.3608L132.15 30.8942L132.915 23.4505L136.608 14.4708L143.994 9.62643L149.725 12.344L154.437 19.0788L153.8 23.4505L150.998 41.6463L145.522 70.1215L141.957 89.2625H143.994L146.414 86.7813L156.093 74.0206L172.266 53.698L179.398 45.6635L187.803 36.802L193.152 32.5484H203.34L210.726 43.6549L207.415 55.1159L196.972 68.3492L188.312 79.5739L175.896 96.2095L168.191 109.585L168.882 110.689L170.738 110.53L198.755 104.504L213.91 101.787L231.994 98.7149L240.144 102.496L241.036 106.395L237.852 114.311L218.495 119.037L195.826 123.645L162.07 131.592L161.696 131.893L162.137 132.547L177.36 133.925L183.855 134.279H199.774L229.447 136.524L237.215 141.605L241.8 147.867L241.036 152.711L229.065 158.737L213.019 154.956L175.45 145.977L162.587 142.787H160.805V143.85L171.502 154.366L191.242 172.089L215.82 195.011L217.094 200.682L213.91 205.172L210.599 204.699L188.949 188.394L180.544 181.069L161.696 165.118H160.422V166.772L164.752 173.152L187.803 207.771L188.949 218.405L187.294 221.832L181.308 223.959L174.813 222.777L161.187 203.754L147.305 182.486L136.098 163.345L134.745 164.2L128.075 235.42L125.019 239.082L117.887 241.8L111.902 237.31L108.718 229.984L111.902 215.452L115.722 196.547L118.779 181.541L121.58 162.873L123.291 156.636L123.14 156.219L121.773 156.449L107.699 175.752L86.304 204.699L69.3663 222.777L65.291 224.431L58.2867 220.768L58.9235 214.27L62.8713 208.48L86.304 178.705L100.44 160.155L109.551 149.507L109.462 147.967L108.959 147.924L46.6977 188.512L35.6182 189.93L30.7788 185.44L31.4156 178.115L33.7079 175.752L52.4285 162.873Z" fill="#D97757"/></svg>`;
const OPENAI_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" fill="none"><g clip-path="url(#a)"><rect width="180" height="180" fill="#fff" rx="90"/><g clip-path="url(#b)"><path fill="#000" d="M75.91 73.628V62.232c0-.96.36-1.68 1.199-2.16l22.912-13.194c3.119-1.8 6.838-2.639 10.676-2.639 14.394 0 23.511 11.157 23.511 23.032 0 .839 0 1.799-.12 2.758l-23.752-13.914c-1.439-.84-2.879-.84-4.318 0L75.91 73.627Zm53.499 44.383v-27.23c0-1.68-.72-2.88-2.159-3.719L97.142 69.55l9.836-5.638c.839-.48 1.559-.48 2.399 0l22.912 13.195c6.598 3.839 11.035 11.995 11.035 19.912 0 9.116-5.397 17.513-13.915 20.992v.001Zm-60.577-23.99-9.836-5.758c-.84-.48-1.2-1.2-1.2-2.16v-26.39c0-12.834 9.837-22.55 23.152-22.55 5.039 0 9.716 1.679 13.676 4.678L70.993 55.516c-1.44.84-2.16 2.039-2.16 3.719v34.787-.002Zm21.173 12.234L75.91 98.339V81.546l14.095-7.917 14.094 7.917v16.793l-14.094 7.916Zm9.056 36.467c-5.038 0-9.716-1.68-13.675-4.678l23.631-13.676c1.439-.839 2.159-2.038 2.159-3.718V85.863l9.956 5.757c.84.48 1.2 1.2 1.2 2.16v26.389c0 12.835-9.957 22.552-23.27 22.552v.001Zm-28.43-26.75L47.72 102.778c-6.599-3.84-11.036-11.996-11.036-19.913 0-9.236 5.518-17.513 14.034-20.992v27.35c0 1.68.72 2.879 2.16 3.718l29.989 17.393-9.837 5.638c-.84.48-1.56.48-2.399 0Zm-1.318 19.673c-13.555 0-23.512-10.196-23.512-22.792 0-.959.12-1.919.24-2.879l23.63 13.675c1.44.84 2.88.84 4.32 0l30.108-17.392v11.395c0 .96-.361 1.68-1.2 2.16l-22.912 13.194c-3.119 1.8-6.837 2.639-10.675 2.639Zm29.748 14.274c14.515 0 26.63-10.316 29.39-23.991 13.434-3.479 22.071-16.074 22.071-28.91 0-8.396-3.598-16.553-10.076-22.43.6-2.52.96-5.039.96-7.557 0-17.153-13.915-29.99-29.989-29.99-3.239 0-6.358.48-9.477 1.56-5.398-5.278-12.835-8.637-20.992-8.637-14.515 0-26.63 10.316-29.39 23.991-13.434 3.48-22.07 16.074-22.07 28.91 0 8.396 3.598 16.553 10.075 22.431-.6 2.519-.96 5.038-.96 7.556 0 17.154 13.915 29.989 29.99 29.989 3.238 0 6.357-.479 9.476-1.559 5.397 5.278 12.835 8.637 20.992 8.637Z"/></g></g><defs><clipPath id="a"><path d="M0 0h180v180H0z"/></clipPath><clipPath id="b"><path d="M29.487 29.964h121.035v119.954H29.487z"/></clipPath></defs></svg>`;
const SVG_GOBBLER_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M11.9999 52.0001C11.9999 46.4772 16.477 42.0001 21.9999 42.0001H31.9999V52.0001C31.9999 57.5229 27.5227 62.0001 21.9999 62.0001V62.0001C16.477 62.0001 11.9999 57.5229 11.9999 52.0001V52.0001Z" fill="#24CB71"/><path d="M32 2V22H42C47.5228 22 52 17.5228 52 12V12C52 6.47715 47.5228 2 42 2L32 2Z" fill="#FF7237"/><circle cx="41.9166" cy="31.9999" r="10" fill="#00B6FF"/><path d="M11.9999 11.9999C11.9999 17.5228 16.477 21.9999 21.9999 21.9999L31.9999 21.9999L31.9999 1.99994L21.9999 1.99994C16.477 1.99994 11.9999 6.47709 11.9999 11.9999V11.9999Z" fill="#FF3737"/><path d="M11.9999 32.0001C11.9999 37.5229 16.477 42.0001 21.9999 42.0001H31.9999L31.9999 22.0001L21.9999 22.0001C16.477 22.0001 11.9999 26.4772 11.9999 32.0001V32.0001Z" fill="#874FFF"/></svg>`;
const TRUST_MRR_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAy4AAADXCAYAAAD8xgXnAAAKBWlDQ1BJQ0MgUHJvZmlsZQAASImVlgdUFNcax+/M9kbbpbel994WkLr0Ir2KyrJLhwWWKmJDghGIKCIioAgSqoIlVAuIKBaCgAL2gAQB5RksiIrKG+TFJK+e951zz/ebb+793zbnzB8AUgorMTEOFgAgnpvC83a0pQcGBdNxcwAGkgAHFIEmi52caOPp6QaQ+D3/Nd6NAWg139Fa1frX9/81BDnhyWwAIE+EEzjJ7HiEexC2YyfyUgCA0QgrpKckrrIqwjQeskCE161y5BqvjqWFrTHnax9fbybCGQDgySwWLxIAYg5Sp6exIxEdYg3CulxONBfhuwhbxscnIONINIRVkT6JCK/qM8L+pBP5F82wb5osVuQ3XtvL1xBmJsQl8OhuTDs6kxUXHcZjpYRz/s+z+Z8RH5f6+3yrN0AO5/r5rO4BaVKACRJAHNJ4gA7ckCc7JDMBC6lFgzCkygIpIBxwUsIzUlYFmAmJW3jRkVEpdBvkFsPpzly2tiZdX1ffCIDVb2JtmjdeX2eCRAb+qO3+BQCL7pWVlfN/1Fy6AThjgpxL5x81VQZy3SQArneyU3lpa7XV6wUYQAT8gAbEgQxQQFavBfSBMTAH1sAeuAAP4AuCwCbABlEgHll3OsgCu0AuyAf7wSFQBirBCVAPToGzoB1cAJfBNXALDIFR8BBMgGnwAiyAd2AZgiAcRIGokDgkCylBGpA+xIAsIXvIDfKGgqBQKBLiQqlQFrQbyoeKoDKoCmqAzkCd0GXoBjQM3YcmoTnoNfQRRsFkmAZLw8qwDsyAbWBX2BfeCEfCSXAmnAPvg0vhavgk3AZfhm/Bo/AE/AJeRAEUCSWCkkNpoRgoJsoDFYyKQPFQ21F5qBJUNaoZ1YXqR91BTaDmUR/QWDQVTUdroc3RTmg/NBudhN6OLkCXoevRbeg+9B30JHoB/QVDwUhhNDBmGGdMICYSk47JxZRgajGtmKuYUcw05h0WixXBqmBNsE7YIGwMdiu2AHsU24LtwQ5jp7CLOBxOHKeBs8B54Fi4FFwu7gjuJK4bN4Kbxr3Hk/CyeH28Az4Yz8Vn40vwjfhL+BH8DH6ZIEBQIpgRPAgcwhZCIaGG0EW4TZgmLBMFiSpEC6IvMYa4i1hKbCZeJT4iviGRSPIkU5IXKZq0k1RKOk26TpokfSALkdXJTHIIOZW8j1xH7iHfJ7+hUCjKFGtKMCWFso/SQLlCeUJ5z0fl0+Zz5uPw7eAr52vjG+F7yU/gV+K34d/En8lfwn+O/zb/vABBQFmAKcAS2C5QLtApMC6wKEgV1BP0EIwXLBBsFLwhOCuEE1IWshfiCOUInRC6IjRFRVEVqEwqm7qbWkO9Sp2mYWkqNGdaDC2fdoo2SFsQFhI2FPYXzhAuF74oPCGCElEWcRaJEykUOSsyJvJRVFrURjRcdK9os+iI6JKYpJi1WLhYnliL2KjYR3G6uL14rPgB8XbxxxJoCXUJL4l0iWMSVyXmJWmS5pJsyTzJs5IPpGApdSlvqa1SJ6QGpBalZaQdpROlj0hfkZ6XEZGxlomRKZa5JDMnS5W1lI2WLZbtln1OF6bb0OPopfQ++oKclJyTXKpcldyg3LK8iryffLZ8i/xjBaICQyFCoVihV2FBUVbRXTFLsUnxgRJBiaEUpXRYqV9pSVlFOUB5j3K78qyKmIqzSqZKk8ojVYqqlWqSarXqXTWsGkMtVu2o2pA6rG6kHqVern5bA9Yw1ojWOKoxrInRNNXkalZrjmuRtWy00rSatCa1RbTdtLO127Vf6ijqBOsc0OnX+aJrpBunW6P7UE9Iz0UvW69L77W+uj5bv1z/rgHFwMFgh0GHwStDDcNww2OG94yoRu5Ge4x6jT4bmxjzjJuN50wUTUJNKkzGGTSGJ6OAcd0UY2prusP0gukHM2OzFLOzZr+Za5nHmjeaz65TWRe+rmbdlIW8BcuiymLCkm4ZannccsJKzoplVW311FrBmmNdaz1jo2YTY3PS5qWtri3PttV2iWnG3MbssUPZOdrl2Q3aC9n72ZfZP3GQd4h0aHJYcDRy3OrY44RxcnU64DTuLO3Mdm5wXnAxcdnm0udKdvVxLXN96qbuxnPrcofdXdwPuj9ar7Seu77dA3g4exz0eOyp4pnked4L6+XpVe71zFvPO8u734fqs9mn0eedr61voe9DP1W/VL9ef37/EP8G/6UAu4CigIlAncBtgbeCJIKigzqCccH+wbXBixvsNxzaMB1iFJIbMrZRZWPGxhubJDbFbbq4mX8za/O5UExoQGhj6CeWB6uatRjmHFYRtsBmsg+zX3CsOcWcuXCL8KLwmQiLiKKI2UiLyIORc1FWUSVR89HM6LLoVzFOMZUxS7EesXWxK3EBcS3x+PjQ+E6uEDeW25cgk5CRMJyokZibOJFklnQoaYHnyqtNhpI3Jnek0JCf70Cqaup3qZNplmnlae/T/dPPZQhmcDMGtqhv2btlJtMh88et6K3srb1Zclm7sia32Wyr2g5tD9veu0NhR86O6Z2OO+t3EXfF7vo5Wze7KPvt7oDdXTnSOTtzpr5z/K4ply+Xlzu+x3xP5ffo76O/H9xrsPfI3i95nLyb+br5JfmfCtgFN3/Q+6H0h5V9EfsGC40Lj+3H7ufuHztgdaC+SLAos2jqoPvBtmJ6cV7x20ObD90oMSypPEw8nHp4otSttOOI4pH9Rz6VRZWNltuWt1RIVeytWDrKOTpyzPpYc6V0ZX7lx+PRx+9VOVa1VStXl5zAnkg78azGv6b/R8aPDbUStfm1n+u4dRP13vV9DSYNDY1SjYVNcFNq09zJkJNDp+xOdTRrNVe1iLTknwanU08/PxN6Zuys69nec4xzzT8p/VTRSm3Na4PatrQttEe1T3QEdQx3unT2dpl3tZ7XPl93Qe5C+UXhi4WXiJdyLq10Z3Yv9iT2zF+OvDzVu7n34ZXAK3f7vPoGr7pevX7N4dqVfpv+7usW1y/cMLvReZNxs/2W8a22AaOB1p+Nfm4dNB5su21yu2PIdKhreN3wpRGrkct37O5cu+t899bo+tHhMb+xe+Mh4xP3OPdm78fdf/Ug7cHyw52PMI/yHgs8Lnki9aT6F7VfWiaMJy5O2k0OPPV5+nCKPfXi1+RfP03nPKM8K5mRnWmY1Z+9MOcwN/R8w/PpF4kvludz/yb4t4qXqi9/+s36t4GFwIXpV7xXK68L3oi/qXtr+LZ30XPxybv4d8tLee/F39d/YHzo/xjwcWY5/RPuU+lntc9dX1y/PFqJX1lJZPFYX60ACmlwRAQAr+sAoAQBQB1C/MOGNc/2D48D/cnt/Ade83VfwxiAZsTTec0j7mYcgNOI71NG9PlDAPCkAOBrCmADg2/td0/11QuuBhZxxce9P4fFh/0777XmE/+07n/O4JvqX/LfAfytuO4HGG/GAAAABGNJQ1AMDQABbgPj7wAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAADLqADAAQAAAABAAAA1wAAAADe+OlwAABAAElEQVR4Ae2dCZgcVbn+v+6efcksmckkmSRkAgkJBCELhAABguyrfxD0oiJ4lavoFe/Vi6AiorjAo4BeV+SR5QoIosgmSwyQhZB9TyD7vmeyT2bt7v/3Vk/NdM/0zHR3VXdXV78HKt1VXXXq1O/UdJ+3vuV4ioqKgsJCAiRAAiRAAiRAAiRAAiRAAg4m4HVw29g0EiABEiABEiABEiABEiABEjAIULjwRiABEiABEiABEiABEiABEnA8AQoXx3cRG0gCJEACJEACJEACJEACJEDhwnuABEiABEiABEiABEiABEjA8QQoXBzfRWwgCZAACZAACZAACZAACZAAhQvvARIgARIgARIgARIgARIgAccToHBxfBexgSRAAiRAAiRAAiRAAiRAAhQuvAdIgARIgARIgARIgARIgAQcT4DCxfFdxAaSAAmQAAmQAAmQAAmQAAlQuPAeIAESIAESIAESIAESIAEScDwBChfHdxEbSAIkQAIkQAIkQAIkQAIkQOHCe4AESIAESIAESIAESIAESMDxBChcHN9FbCAJkAAJkAAJkAAJkAAJkACFC+8BEiABEiABEiABEiABEiABxxOgcHF8F7GBJEACJEACJEACJEACJEACFC68B0iABEiABEiABEiABEiABBxPgMLF8V3EBpIACZAACZAACZAACZAACVC48B4gARIgARIgARIgARIgARJwPAEKF8d3ERtIAiRAAiRAAiRAAiRAAiRA4cJ7gARIgARIgARIgARIgARIwPEEKFwc30VsIAmQAAmQAAmQAAmQAAmQAIUL7wESIAESIAESIAESIAESIAHHE6BwcXwXsYEkQAIkQAIkQAIkQAIkQAIULrwHSIAESIAESIAESIAESIAEHE+AwsXxXcQGkgAJkAAJkAAJkAAJkAAJULjwHiABEiABEiABEiABEiABEnA8AQoXx3cRG0gCJEACJEACJEACJEACJEDhwnuABEiABEiABEiABEiABEjA8QQoXBzfRWwgCZAACZAACZAACZAACZAAhQvvARIgARIgARIgARIgARIgAccToHBxfBexgSRAAiRAAiRAAiRAAiRAAhQuvAdIgARIgARIgARIgARIgAQcT4DCxfFdxAaSAAmQAAmQAAmQAAmQAAlQuPAeIAESIAESIAESIAESIAEScDwBChfHdxEbSAIkQAIkQAIkQAIkQAIkQOHC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EDDtgsUUMtgjVNpfsa8vR8oHTNSsZAOl6fhOPZziJYndxqpTQMDnY8xWCjDzFCRAAgkQyMvLS+Co0CFnn322PPfccxIIaIKdNJULL7wwYdGSpiZbPm2Ozo9XUVFhLCeddFJHfbDQQIjNnj1bFi1alDYR09GgNL1xEx8KlyTeRBAr/WvO13lYSo1YFZzKFCgQMIbdpV3DdIa8QLCY4kU/NN6qBMotkupBU2T7xhcpXJLYZ6yaBEiABEiABBIlgAHilClTZMaMGYlWYfk4uCOzhAjALRtCBsvnP/95ipguN0Ym8knMjtjlwrkanYDH65Mhw6+M8uQjJFqC6idmLtFrCNuqrma1wy9Tyw2fVIdR4VsSIAESIAESCBDCLhQuJjkkcKXg2qThr2vZGsvT9ZGAiRAAiRAAiRAAiTQFwEX+/pQtPTV+Yl/TraJs+ORJEACJEACJEACJEACiRBwsXBJBAePIQESIAESIAESIAESIAEScCIBChcn9grbRAIkQAIkQAIkQAIkQAIkEEGAwiUCB1dIgARIgARIgARIgARIgAScSIDCxYm9wjaRAAmQAAmQAAmQAAmQAAlEEKBwicDBFRIgARIgARIgARIgARIgAScSoHBxYq+wTSRAAiRAAiRAAiRAAiRAAhEEKFwicHCFBEiABEiABEiABEiABEjAiQQoXJzYK2wTCZAACZAACZAACZAACZBABAEKlwgcXCEBEiABEiABEiABEiABEnAiAQoXJ/YK20QCJEACJEACJEACJEACJBBBgMIlAgdXSIAESIAESIAESIAESIAEnEiAwsWJvcI2kQAJkAAJkAAJkAAJkAAJRBCgcInAwRUSIAESIAESIAESIAESIAEnEqBwcWKvsE0kQAIkQAIkQAIkQAIkQAIRBChcInBwhQRIgARIgARIgARIgARIwIkEKFyc2CtsEwmQAAmQAAmQAAmQAAmQQAQBCpcIHFwhARIgARIgARIgARIgARJwIgEKFyf2CttEAiRAAiRAAiRAAiRAAiQQQYDCJQIHV0iABEiABEiABEiABEiABJxIgMLFib3CNpEACZAACZAACZAACZAACUQQoHCJwMEVEiABEiABEiABEiABEiABJxKgcHFir7BNJEACJEACJEACJEACJEACEQQoXCJwcIUESIAESIAESIAESIAESMCJBChcnNgrbBMJkAAJkAAJkAAJkAAJkEAEAQqXCBxcIQESIAESIAESIAESIAEScCIBChcn9grbRAIkQAIkQAIkQAIkQAIkEEGAwiUCB1dIgARIgARIgARIgARIgAScSIDCxYm9wjaRAAmQAAmQAAmQAAmQAAlEEKBwicDBFRIgARIgARIgARIgARIgAScSoHBxYq+wTSRAAiRAAiRAAiRAAiRAAhEEKFwicHCFBEiABEiABEiABEiABEjAiQQoXJzYK2wTCZAACZAACZAACZAACZBABAEKlwgcXCEBEiABEiABEiABEiABEnAiAQoXJ/YK20QCJEACJEACJEACJEACJBBBgMIlAgdXSIAESIAESIAESIAESIAEnEjg/wPekUHP1Ws5lQAAAABJRU5ErkJggg==';

const MOCK_SLOT_LOGOS = [TRUST_MRR_LOGO, CLAUDE_LOGO, OPENAI_LOGO, SVG_GOBBLER_LOGO];

interface OvenProps {
  brands: PublicBrand[];
  screenshot?: string;
  ovenState: 'idle' | 'cooking' | 'complete';
  onUrlSubmit: (url: string) => void;
  url?: string;
  currentStage?: string;
  subStage?: string;
  illuminatedSponsors?: number[];
  error?: string;
}

export default function Oven({ 
  brands, screenshot, 
  ovenState, 
  onUrlSubmit, 
  url,
  currentStage, 
  subStage,
  illuminatedSponsors = [],
  error,
}: OvenProps) {
  const details = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<PublicBrand>();
  const [bidding, setBidding] = useState(false);
  const inspect = (brand: PublicBrand) => { setSelected(brand); setBidding(brand.eligibleSpend === 0); details.current?.showModal(); };
  const getBrand = (index: number): PublicBrand => {
    if (brands[index]) return brands[index];
    return {
      id: `placeholder-${index}`,
      rank: index + 1,
      name: 'Available',
      normalizedDomain: '',
      destinationUrl: '#',
      tagline: 'Claim this spot',
      logoSvg: MOCK_SLOT_LOGOS[index % MOCK_SLOT_LOGOS.length],
      eligibleSpend: 0,
      earliestExpiry: '',
      impressions: 0,
      clicks: 0,
      overtakeAmount: 10,
    };
  };

  const brand1 = getBrand(0);
  const brand2 = getBrand(1);
  const brand3 = getBrand(2);
  const smallBrands = [getBrand(3), getBrand(4), getBrand(5), getBrand(6), getBrand(7)];

  return (
    <div className={styles.ovenWrapper} aria-busy={ovenState === 'cooking'}>
      {/* Top Chimney */}
      <div className={styles.chimney}>
        <div className={styles.ventSlits}>
          <div className={styles.ventSlit} />
          <div className={styles.ventSlit} />
          <div className={styles.ventSlit} />
        </div>
      </div>
      
      {/* Machine Chassis Structure */}
      <div className={styles.machineChassis}>
        {/* Tier 1: #1 Top Sponsor Housing with Shoulder Wings */}
        <div className={styles.tier1Housing}>
          <div className={styles.shoulderWingLeft} />
          <div className={styles.topPlateContainer}>
            <SponsorPlate 
              brand={brand1} 
              size="large" 
              illuminated={illuminatedSponsors.includes(1)}
              onSelect={inspect}
            />
          </div>
          <div className={styles.shoulderWingRight} />
        </div>

        {/* Tier 2: #2 Plate + Central Chamber + #3 Plate */}
        <div className={styles.tier2Housing}>
          <span className={`${styles.screw} ${styles.screwT2TL}`} />
          <span className={`${styles.screw} ${styles.screwT2TR}`} />
          <span className={`${styles.screw} ${styles.screwT2BL}`} />
          <span className={`${styles.screw} ${styles.screwT2BR}`} />

          <div className={styles.plate2}>
            <SponsorPlate 
              brand={brand2} 
              size="medium" 
              illuminated={illuminatedSponsors.includes(2)}
              onSelect={inspect}
            />
          </div>
          
          <div className={styles.chamberWrapper}>
            <OvenChamber state={ovenState} url={url} screenshot={screenshot} />
          </div>

          <div className={styles.plate3}>
            <SponsorPlate 
              brand={brand3} 
              size="medium" 
              illuminated={illuminatedSponsors.includes(3)}
              onSelect={inspect}
            />
          </div>
        </div>

        {/* Tier 3: URL Console Row */}
        <div className={styles.tier3ConsoleHousing}>
          <span className={`${styles.screw} ${styles.screwConsoleL}`} />
          <span className={`${styles.screw} ${styles.screwConsoleR}`} />

          <URLConsole 
            state={ovenState} 
            onSubmit={onUrlSubmit} 
            currentStage={currentStage} 
            subStage={subStage}
            error={error}
          />
        </div>

        {/* Tier 4: Bottom Sponsor Rail Housing (#4 to #8) */}
        <div className={styles.tier4RailHousing}>
          <span className={`${styles.screw} ${styles.screwT4TL}`} />
          <span className={`${styles.screw} ${styles.screwT4TR}`} />
          <span className={`${styles.screw} ${styles.screwT4BL}`} />
          <span className={`${styles.screw} ${styles.screwT4BR}`} />

          <div className={styles.rail}>
            {smallBrands.map((brand) => (
              <SponsorPlate 
                key={brand.rank}
                brand={brand} 
                size="small" 
                illuminated={illuminatedSponsors.includes(brand.rank)}
                onSelect={inspect}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Base Metal Feet */}
      <div className={styles.baseFeet}>
        <div className={styles.foot} />
        <div className={styles.foot} />
      </div>
      <dialog ref={details} className={styles.sponsorDialog} aria-labelledby="sponsor-title">
        <div className={styles.dialogHeader}><span>PAID HEAT POSITION</span><button type="button" onClick={() => details.current?.close()} aria-label="Close sponsor details">X</button></div>
        {selected && bidding ? <BidForm key={selected.rank} initialRank={selected.rank} embedded /> : selected && <div className={styles.dialogBody}>
          <h2 id="sponsor-title">#{selected.rank} {selected.name}</h2>
          <p>{selected.tagline || (selected.eligibleSpend ? selected.normalizedDomain : 'This heat position is available.')}</p>
          <dl><div><dt>Seven-day spend</dt><dd>${selected.eligibleSpend.toLocaleString()}</dd></div><div><dt>Earliest expiry</dt><dd>{selected.earliestExpiry ? new Date(selected.earliestExpiry).toLocaleString() : 'No active spend'}</dd></div><div><dt>Impressions / clicks</dt><dd>{selected.impressions.toLocaleString()} / {selected.clicks.toLocaleString()}</dd></div><div><dt>Takeover payment</dt><dd>From ${selected.overtakeAmount.toLocaleString()}</dd></div></dl>
          <p className={styles.disclosure}>Positions are paid and ranked by active seven-day spend. Contributions normally cannot be refunded and expire from ranking after seven days.</p>
          <div className={styles.dialogActions}>{selected.eligibleSpend > 0 && <a href={`/go/${selected.id}?placement=oven-${selected.rank}`}>Visit brand</a>}<button type="button" onClick={() => setBidding(true)}>Take this position</button></div>
        </div>}
      </dialog>
    </div>
  );
}
