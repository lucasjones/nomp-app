#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->poolList->setModel(&poolList);
    ui->keyList->setModel(&keyList);
    poolList << "Test pool - http://127.0.0.1/";
    poolList << "Test pool 2 - http://127.0.0.1/";
    keyList << "NOMP Donation address - 22851477d63a085dbc2398c8430af1c09e7343f6";
    connect(ui->poolList->selectionModel(), SIGNAL(selectionChanged(QItemSelection,QItemSelection)),
            this, SLOT(poolSelectionChanged(QItemSelection,QItemSelection)));
    connect(ui->keyList->selectionModel(), SIGNAL(selectionChanged(QItemSelection,QItemSelection)),
            this, SLOT(keySelectionChanged(QItemSelection,QItemSelection)));
    aboutDialog = new AboutDialog(this);
}

MainWindow::~MainWindow()
{
    delete aboutDialog;
    delete ui;
}

void MainWindow::poolSelectionChanged(QItemSelection current, QItemSelection previous)
{
    bool enabled = !current.isEmpty();
    ui->connectPool->setEnabled(enabled);
    ui->deletePool->setEnabled(enabled);
    ui->editPool->setEnabled(enabled);
}

void MainWindow::keySelectionChanged(QItemSelection current, QItemSelection previous)
{
    bool enabled = !current.isEmpty();
    ui->exportKey->setEnabled(enabled);
    ui->deleteKey->setEnabled(enabled);
    ui->editKey->setEnabled(enabled);
}

void MainWindow::on_actionAbout_triggered()
{
    aboutDialog->show();
}
