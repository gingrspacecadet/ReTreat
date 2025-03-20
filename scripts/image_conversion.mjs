export async function convertToWebPBase64(file) {
      if (!file) {
        alert("No file selected.");
        return;
      }

      const reader = new FileReader();

      reader.onload = async function(event) {
        const img = new Image();
        img.onload = async function() {
          // Resize the image (using maxPixels)
          const maxPixels = 800 * 600; // Adjust as needed (e.g., 480000)
          let width = img.width;
          let height = img.height;
          const totalPixels = width * height;

          if (totalPixels > maxPixels) {
            const scaleRatio = Math.sqrt(maxPixels / totalPixels);
            width = Math.round(width * scaleRatio);
            height = Math.round(height * scaleRatio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const webpBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
          const webpBuffer = await webpBlob.arrayBuffer();
          const webpBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(webpBuffer)));

          return = webpBase64;
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }

    export async function convertBase64ToPNG() {
      const base64Input = document.getElementById('base64Input').value;
      try {
        const binaryString = atob(base64Input);
        const byteArr = new Uint8Array(binaryString.length);
        const progressBar = document.getElementById('progressBar').querySelector('div');
        const totalBytes = binaryString.length;

        for (let i = 0; i < binaryString.length; i++) {
          byteArr[i] = binaryString.charCodeAt(i);
          const progress = (i + 1) / totalBytes * 100;
          progressBar.style.width = progress + '%';
        }

        const webpBlob = new Blob([byteArr], {
          type: 'image/webp'
        });
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted_image.png';

            requestAnimationFrame(() => {
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              progressBar.style.width = '0%';
            });
          }, 'image/png');
        }
        img.src = URL.createObjectURL(webpBlob);
      } catch (error) {
        console.error("Decompression error:", error);
        alert("Decompression error: " + error);
        document.getElementById('progressBar').querySelector('div').style.width = '0%';
      }
    }

    export async function convertBase64ToWebP() {
      const base64Input = document.getElementById('base64Input').value;
      try {
        const binaryString = atob(base64Input);
        const byteArr = new Uint8Array(binaryString.length);
        const progressBar = document.getElementById('progressBar').querySelector('div');
        const totalBytes = binaryString.length;

        for (let i = 0; i < binaryString.length; i++) {
          byteArr[i] = binaryString.charCodeAt(i);
          const progress = (i + 1) / totalBytes * 100;
          progressBar.style.width = progress + '%';
        }

        const webpBlob = new Blob([byteArr], {
          type: 'image/webp'
        });
        const url = URL.createObjectURL(webpBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_image.webp';

        requestAnimationFrame(() => {
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          progressBar.style.width = '0%';
        });
      } catch (error) {
        console.error("Decompression error:", error);
        alert("Decompression error: " + error);
        document.getElementById('progressBar').querySelector('div').style.width = '0%';
      }
    }
