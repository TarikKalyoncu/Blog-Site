export class UploadAdapter {
    private loader;
  
    constructor(loader: any) {
      this.loader = loader;
    }
  
    upload() {
        return this.loader.file
              .then( (file: Blob) => new Promise( ( resolve, reject ) => {
                    var myReader= new FileReader();
                    myReader.onloadend = (e) => {
                       resolve({ default: myReader.result });
                    }
  
                    myReader.readAsDataURL(file);
              } ) );
     };
    readThis(file: Blob): Promise<any> {
      let imagePromise: Promise<any> = new Promise((resolve, reject) => {
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
          let image = myReader.result;
          resolve({ default: "data:image/png;base64," + image });

        };
        myReader.readAsDataURL(file);
      });
  
      return imagePromise;
    }
  }
  