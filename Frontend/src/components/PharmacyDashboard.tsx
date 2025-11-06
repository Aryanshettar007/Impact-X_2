import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  BarChart3,
  LogOut,
  Pill,
  AlertTriangle,
  TrendingUp,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PharmacyDashboardProps {
  onLogout: () => void;
}

interface Medicine {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'];

export function PharmacyDashboard({ onLogout }: PharmacyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-stock' | 'inventory' | 'analytics'>('dashboard');
  const [newMedicine, setNewMedicine] = useState({ name: '', price: '', quantity: '' });
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Paracetamol 500mg', price: 45, quantity: 150, status: 'In Stock' },
    { id: 2, name: 'Amoxicillin 250mg', price: 120, quantity: 8, status: 'Low Stock' },
    { id: 3, name: 'Ibuprofen 400mg', price: 85, quantity: 200, status: 'In Stock' },
    { id: 4, name: 'Cetirizine 10mg', price: 35, quantity: 0, status: 'Out of Stock' },
    { id: 5, name: 'Vitamin D3', price: 250, quantity: 75, status: 'In Stock' },
    { id: 6, name: 'Aspirin 75mg', price: 55, quantity: 12, status: 'Low Stock' }
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', quantity: '' });

  const salesData = [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Apr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 }
  ];

  const categoryData = [
    { name: 'Pain Relief', value: 35 },
    { name: 'Antibiotics', value: 25 },
    { name: 'Vitamins', value: 20 },
    { name: 'Others', value: 20 }
  ];

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  const popularMedicines = medicines.filter(m => m.quantity > 100).length;

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedicine.name && newMedicine.price && newMedicine.quantity) {
      const quantity = parseInt(newMedicine.quantity);
      const status: Medicine['status'] = quantity === 0 ? 'Out of Stock' : quantity < 20 ? 'Low Stock' : 'In Stock';
      
      setMedicines([
        ...medicines,
        {
          id: medicines.length + 1,
          name: newMedicine.name,
          price: parseFloat(newMedicine.price),
          quantity,
          status
        }
      ]);
      setNewMedicine({ name: '', price: '', quantity: '' });
      toast.success('Medicine added successfully!');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingId(medicine.id);
    setEditForm({
      name: medicine.name,
      price: medicine.price.toString(),
      quantity: medicine.quantity.toString()
    });
  };

  const handleSaveEdit = (id: number) => {
    const quantity = parseInt(editForm.quantity);
    const status: Medicine['status'] = quantity === 0 ? 'Out of Stock' : quantity < 20 ? 'Low Stock' : 'In Stock';
    
    setMedicines(medicines.map(m =>
      m.id === id
        ? { ...m, name: editForm.name, price: parseFloat(editForm.price), quantity, status }
        : m
    ));
    setEditingId(null);
    toast.success('Medicine updated successfully!');
  };

  const handleDelete = (id: number) => {
    setMedicines(medicines.filter(m => m.id !== id));
    toast.success('Medicine deleted successfully!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    setTimeout(onLogout, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-emerald-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            MediFind
          </span>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant={activeTab === 'add-stock' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'add-stock' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : ''}`}
            onClick={() => setActiveTab('add-stock')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
          
          <Button
            variant={activeTab === 'inventory' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'inventory' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </Button>
          
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'analytics' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          
          <div className="pt-4 border-t border-emerald-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Overview of your pharmacy operations
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-emerald-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Medicines</CardTitle>
                  <Pill className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-emerald-700 dark:text-emerald-400">{totalMedicines}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    In your inventory
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Low Stock Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-amber-700 dark:text-amber-400">{lowStockCount}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Need attention
                  </p>
                </CardContent>
              </Card>

              <Card className="border-teal-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Popular Medicines</CardTitle>
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-teal-700 dark:text-teal-400">{popularMedicines}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    High stock items
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Inventory Preview */}
            <Card className="border-emerald-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-400">Quick Inventory View</CardTitle>
                <CardDescription className="dark:text-gray-400">Recent stock updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicines.slice(0, 5).map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-gray-100">{medicine.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">₹{medicine.price} • Qty: {medicine.quantity}</p>
                      </div>
                      <Badge
                        className={
                          medicine.status === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                            : medicine.status === 'Low Stock'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }
                      >
                        {medicine.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Stock Tab */}
        {activeTab === 'add-stock' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Add Stock
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Add new medicines to your inventory
              </p>
            </div>

            <Card className="border-emerald-200 dark:border-gray-700 shadow-lg max-w-2xl">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-400">Medicine Details</CardTitle>
                <CardDescription className="dark:text-gray-400">Enter the medicine information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMedicine} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicine-name">Medicine Name</Label>
                    <Input
                      id="medicine-name"
                      placeholder="e.g., Paracetamol 500mg"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                      className="border-emerald-200 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicine-price">Price (₹)</Label>
                      <Input
                        id="medicine-price"
                        type="number"
                        placeholder="0.00"
                        value={newMedicine.price}
                        onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                        className="border-emerald-200 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicine-quantity">Quantity</Label>
                      <Input
                        id="medicine-quantity"
                        type="number"
                        placeholder="0"
                        value={newMedicine.quantity}
                        onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })}
                        className="border-emerald-200 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Medicine
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your medicine stock
              </p>
            </div>

            <Card className="border-emerald-200 dark:border-gray-700 shadow-lg">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine Name</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell>
                          {editingId === medicine.id ? (
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="h-8 border-emerald-200 dark:border-gray-600 dark:bg-gray-700"
                            />
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100">{medicine.name}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === medicine.id ? (
                            <Input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="h-8 w-24 border-emerald-200 dark:border-gray-600 dark:bg-gray-700"
                            />
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100">₹{medicine.price}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === medicine.id ? (
                            <Input
                              type="number"
                              value={editForm.quantity}
                              onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                              className="h-8 w-20 border-emerald-200 dark:border-gray-600 dark:bg-gray-700"
                            />
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100">{medicine.quantity}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              medicine.status === 'In Stock'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                : medicine.status === 'Low Stock'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }
                          >
                            {medicine.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === medicine.id ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleSaveEdit(medicine.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleEdit(medicine)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(medicine.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View your pharmacy performance metrics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-emerald-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-emerald-700 dark:text-emerald-400">Monthly Sales</CardTitle>
                  <CardDescription className="dark:text-gray-400">Revenue trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #10b981',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="sales" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-emerald-700 dark:text-emerald-400">Medicine Categories</CardTitle>
                  <CardDescription className="dark:text-gray-400">Stock distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
