import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {

  // ==========================================
  // PRODUCTS
  // ==========================================

  products: any[] = [];
  filteredProducts: any[] = [];
  loading: boolean = true;


  // ==========================================
  // SEARCH
  // ==========================================

  searchTerm: string = '';


  // ==========================================
  // ADD / EDIT MODAL
  // ==========================================

  showAddProductModal: boolean = false;

  editingProduct: any = null;


  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  selectedImage: File | null = null;

  imagePreview: string | null = null;


  // ==========================================
  // NEW PRODUCT
  // ==========================================

  newProduct: any = {

    name: '',
    category: '',
    image: '',
    price: null,
    discount: 0,
    description: '',
    stock: 0,
    isBestSeller: false

  };


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private adminService: AdminService
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadProducts();

  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  loadProducts(): void {

    this.loading = true;

    this.adminService.getProducts().subscribe({

      next: (data) => {

        this.products = data.products || [];

        this.filteredProducts = [...this.products];

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error loading products:',
          error
        );

        this.products = [];

        this.filteredProducts = [];

        this.loading = false;

      }

    });

  }


  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  searchProducts(): void {

    const search = this.searchTerm
      .toLowerCase()
      .trim();


    if (!search) {

      this.filteredProducts = [...this.products];

      return;

    }


    this.filteredProducts = this.products.filter(
      (product) => {

        const name =
          product.name?.toLowerCase() || '';

        const category =
          product.category?.toLowerCase() || '';


        return (
          name.includes(search) ||
          category.includes(search)
        );

      }
    );

  }


  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  openAddProductModal(): void {

    this.editingProduct = null;

    this.resetProductForm();

    this.showAddProductModal = true;

  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  closeAddProductModal(): void {

    this.showAddProductModal = false;

    this.editingProduct = null;

    this.resetProductForm();

  }


  // ==========================================
  // RESET FORM
  // ==========================================

  resetProductForm(): void {

    this.newProduct = {

      name: '',
      category: '',
      image: '',
      price: null,
      discount: 0,
      description: '',
      stock: 0,
      isBestSeller: false

    };


    this.selectedImage = null;

    this.imagePreview = null;

  }


  // ==========================================
  // SELECT IMAGE
  // ==========================================

  onImageSelected(event: any): void {

    const file = event.target.files?.[0];

    if (!file) {

      return;

    }


    // Allowed image types

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];


    // Check file type

    if (!allowedTypes.includes(file.type)) {

      alert(
        'Please select a JPG, PNG or WEBP image.'
      );

      event.target.value = '';

      return;

    }


    // Check file size - 5MB

    if (file.size > 5 * 1024 * 1024) {

      alert(
        'Image size must be less than 5MB.'
      );

      event.target.value = '';

      return;

    }


    // Save selected file

    this.selectedImage = file;


    // Create preview

    this.imagePreview =
      URL.createObjectURL(file);

  }


  // ==========================================
  // REMOVE SELECTED IMAGE
  // ==========================================

  removeSelectedImage(): void {

    this.selectedImage = null;


    // If editing an existing product
    // show the old image again

    if (
      this.editingProduct &&
      this.editingProduct.image
    ) {

      this.imagePreview =
        this.getImageUrl(
          this.editingProduct.image
        );

    } else {

      this.imagePreview = null;

    }

  }


  // ==========================================
  // GET IMAGE URL
  // ==========================================

  getImageUrl(image: string): string {

    if (!image) {

      return '';

    }


    // If image is already a full URL

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }


    // Backend image path

    return `http://localhost:5000${image}`;

  }


  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  addProduct(): void {

    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (
      !this.newProduct.name ||
      !this.newProduct.category ||
      this.newProduct.price === null ||
      this.newProduct.price === undefined ||
      !this.newProduct.description
    ) {

      alert(
        'Please fill in all required fields.'
      );

      return;

    }


    // ========================================
    // IMAGE REQUIRED WHEN ADDING
    // ========================================

    if (
      !this.editingProduct &&
      !this.selectedImage
    ) {

      alert(
        'Please select a product image.'
      );

      return;

    }


    // ========================================
    // CREATE FORMDATA
    // ========================================

    const formData = new FormData();


    formData.append(
      'name',
      this.newProduct.name
    );


    formData.append(
      'category',
      this.newProduct.category
    );


    formData.append(
      'price',
      String(this.newProduct.price)
    );


    formData.append(
      'discount',
      String(this.newProduct.discount || 0)
    );


    formData.append(
      'description',
      this.newProduct.description
    );


    formData.append(
      'stock',
      String(this.newProduct.stock || 0)
    );


    formData.append(
      'isBestSeller',
      String(this.newProduct.isBestSeller)
    );


    // Add image only if user selected one

    if (this.selectedImage) {

      formData.append(
        'image',
        this.selectedImage
      );

    }


    // ========================================
    // EDIT PRODUCT
    // ========================================

    if (this.editingProduct) {

      this.adminService
        .updateProduct(
          this.editingProduct._id,
          formData
        )
        .subscribe({

          next: () => {

            alert(
              'Product updated successfully.'
            );

            this.closeAddProductModal();

            this.loadProducts();

          },

          error: (error) => {

            console.error(
              'Error updating product:',
              error
            );

            alert(
              error?.error?.message ||
              'Failed to update product.'
            );

          }

        });

      return;

    }


    // ========================================
    // ADD NEW PRODUCT
    // ========================================

    this.adminService
      .addProduct(formData)
      .subscribe({

        next: () => {

          alert(
            'Product added successfully.'
          );

          this.closeAddProductModal();

          this.loadProducts();

        },

        error: (error) => {

          console.error(
            'Error adding product:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to add product.'
          );

        }

      });

  }


  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  editProduct(product: any): void {

    this.editingProduct = product;


    // Fill form with current product data

    this.newProduct = {

      name: product.name || '',

      category: product.category || '',

      image: product.image || '',

      price: product.price ?? null,

      discount: product.discount ?? 0,

      description: product.description || '',

      stock: product.stock ?? 0,

      isBestSeller:
        product.isBestSeller ?? false

    };


    // No new image selected yet

    this.selectedImage = null;


    // Show current product image

    if (product.image) {

      this.imagePreview =
        this.getImageUrl(
          product.image
        );

    } else {

      this.imagePreview = null;

    }


    this.showAddProductModal = true;

  }


  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  deleteProduct(productId: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this product?'
    );


    if (!confirmed) {

      return;

    }


    this.adminService
      .deleteProduct(productId)
      .subscribe({

        next: () => {

          alert(
            'Product deleted successfully.'
          );

          this.loadProducts();

        },

        error: (error) => {

          console.error(
            'Error deleting product:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to delete product.'
          );

        }

      });

  }

}