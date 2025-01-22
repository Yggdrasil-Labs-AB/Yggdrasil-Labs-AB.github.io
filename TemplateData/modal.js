(function (global) {
    const AirDropModal = {
        dialog: null,
        form: null,
        data: null,
        isDialogOpen: false,
        callback: null,

        openDialog: function (callback) {
            const dialog = this.dialog;
            dialog.showModal();
            this.isDialogOpen = true;
            this.callback = callback;

            this.form.reset();
        },
        init: function () {
            this.dialog = document.querySelector('#airdrop-modal');
            this.form = document.querySelector('#airdrop-form');
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.dialog.addEventListener('click', this.dismissDialog.bind(this));
        },

        closeDialog: function () {
            const dialog = this.dialog;
            dialog.close();
            this.isDialogOpen = false;
        },
        dismissDialog: function (event) {
            const dialogContent = document.querySelector('.modal-content');
            if (!this.isDialogOpen) return;
            if (!dialogContent.contains(event.target)) {
                this.closeDialog();
            }
        },
        handleSubmit: function (event) {
            event.preventDefault();
            this.closeDialog();
            const formData = new FormData(this.form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            this.data = data;
            console.log('address: ', this.data);
            if (this.callback) {
                this.callback(data);
                this.callback = null;
            }
        },
    }

    global.AirDropModal = AirDropModal;
})(window);
