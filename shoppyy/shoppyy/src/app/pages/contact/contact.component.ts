import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit{


   contactForm!: FormGroup;

  sending: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {

    this.contactForm = this.fb.group({

      name: ['', Validators.required],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      subject: ['', Validators.required],

      message: ['', Validators.required]

    });

  }

  onSubmit(): void {

    // Check validation
    if (this.contactForm.invalid) {

      this.contactForm.markAllAsTouched();

      return;
    }

    this.sending = true;

    // Get form data
    const contactData = this.contactForm.value;

    console.log('CONTACT DATA:', contactData);

    // Send to backend
    this.contactService.sendMessage(contactData).subscribe({

      next: (res) => {

        console.log('MESSAGE SENT:', res);

        this.sending = false;

        alert('Your message has been sent successfully ❤️');

        // Reset form
        this.contactForm.reset();

      },

      error: (err) => {

        console.error('ERROR SENDING MESSAGE:', err);

        this.sending = false;

        alert(
          err.error?.message ||
          'Something went wrong while sending your message'
        );

      }

    });

  }

}