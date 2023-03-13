import { Directive, OnDestroy, OnInit, ElementRef, Input } from '@angular/core';

interface CredentialRequestOptions {
  otp: any;
  signal: any;
}

@Directive({
  selector: '[appWebOtp]'
})

export class WebOtpDirective implements OnInit, OnDestroy {
  
  private ac = new AbortController();
  private timer: NodeJS.Timeout | null = null;
  @Input('timeout') timeout?: number;
  
  constructor(private el: ElementRef) { };

  ngOnInit(): void {

    const options: CredentialRequestOptions = {
      otp: { transport: ['sms'] },
      signal: this.ac.signal
    }

    navigator.credentials.get(options).then((otp: any) => {
      this.el.nativeElement.value = otp.code;
    }).catch(err => {
      console.log(err);
    });

    if (this.timeout) {
      this.timer = setTimeout(() => {
        this.ac.abort();
      }, this.timeout)
    }
  }

  ngOnDestroy(): void {
    this.ac.abort();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

}
